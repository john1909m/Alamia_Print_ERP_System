package com.spring.boot.service.impl;

import com.spring.boot.dto.CompanyDto;
import com.spring.boot.mapper.CompanyMapper;
import com.spring.boot.model.Company;
import com.spring.boot.repo.CompanyRepository;
import com.spring.boot.service.interfaces.CompanyService;
import com.spring.boot.exception.ResourceNotFoundException;
import com.spring.boot.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Company entity.
 * Implements clean service architecture with proper transaction management,
 * error handling, and business rule validation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public CompanyDto create(CompanyDto companyDto) {
        log.info("Creating new company with name: {}", companyDto.getName());
        validateDuplicateName(companyDto.getName(), null);
        Company company = companyMapper.toEntity(companyDto);
        Company savedCompany = companyRepository.save(company);
        log.info("Company created successfully with id: {}", savedCompany.getId());
        return companyMapper.toDto(savedCompany);
    }

    @Override
    @Transactional
    public CompanyDto update(Long id, CompanyDto companyDto) {
        log.info("Updating company with id: {}", id);
        Company existingCompany = findCompanyOrThrow(id);
        // Ensure DTO has id to prevent nulling during merge
        if (companyDto.getId() == null) {
            companyDto.setId(id);
        }
        // Check for duplicate name if name is changing
        String currentName = existingCompany.getName();
        String newName = companyDto.getName();
        if (!currentName.equalsIgnoreCase(newName)) {
            validateDuplicateName(newName, id);
        }
        companyMapper.updateEntityFromDto(companyDto, existingCompany);
        Company updatedCompany = companyRepository.save(existingCompany);
        log.info("Company updated successfully with id: {}", updatedCompany.getId());
        return companyMapper.toDto(updatedCompany);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.info("Deleting company with id: {}", id);
        Company company = findCompanyOrThrow(id);
        validateDelete(company.getId());
        companyRepository.deleteById(id);
        log.info("Company deleted successfully with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyDto findById(Long id) {
        log.info("Fetching company with id: {}", id);
        Company company = findCompanyOrThrow(id);
        log.info("Company found: {}", company.getName());
        return companyMapper.toDto(company);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> findAll() {
        log.info("Fetching all companies");
        List<CompanyDto> companies = companyRepository.findAll().stream()
                .map(companyMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} companies", companies.size());
        return companies;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyDto> findAll(Pageable pageable) {
        log.info("Fetching paginated companies with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<CompanyDto> companies = companyRepository.findAll(pageable)
                .map(companyMapper::toDto);
        log.info("Found {} companies (total pages: {}, total elements: {})",
                companies.getContent().size(),
                companies.getTotalPages(),
                companies.getTotalElements());
        return companies;
    }

    /**
     * Finds a company by ID or throws ResourceNotFoundException if not found.
     *
     * @param id the company ID to search for
     * @return the found Company entity
     * @throws ResourceNotFoundException if company with given ID is not found
     */
    private Company findCompanyOrThrow(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    /**
     * Validates that the company name is unique (excluding the optional companyId).
     * Throws BadRequestException if a duplicate is found.
     *
     * @param name      the company name to validate
     * @param excludeId the company ID to exclude from the check (null for create)
     */
    private void validateDuplicateName(String name, Long excludeId) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Company name is required");
        }
        String jpql = "SELECT COUNT(c) FROM Company c WHERE LOWER(c.name) = LOWER(:name)";
        if (excludeId != null) {
            jpql += " AND c.id <> :excludeId";
        }
        TypedQuery<Long> query = entityManager.createQuery(jpql, Long.class)
                .setParameter("name", name);
        if (excludeId != null) {
            query.setParameter("excludeId", excludeId);
        }
        long count = query.getSingleResult();
        if (count > 0) {
            throw new BadRequestException("Company name already exists: " + name);
        }
    }

    /**
     * Validates that it is safe to delete the company (no related Products or Production Orders).
     * Throws BadRequestException if related entities exist.
     *
     * @param companyId the company ID to validate
     */
    private void validateDelete(Long companyId) {
        boolean hasRelatedProducts = hasRelatedProducts(companyId);
        boolean hasRelatedProductionOrders = hasRelatedProductionOrders(companyId);
        if (hasRelatedProducts || hasRelatedProductionOrders) {
            throw new BadRequestException("Cannot delete company because it has related products or production orders");
        }
    }

    /**
     * Checks if the company has any related Product entities.
     *
     * @param companyId the company ID
     * @return true if related products exist
     */
    private boolean hasRelatedProducts(Long companyId) {
        String jpql = "SELECT COUNT(p) FROM Product p WHERE p.company.id = :companyId";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("companyId", companyId)
                .getSingleResult();
        return count > 0;
    }

    /**
     * Checks if the company has any related ProductionOrder entities.
     *
     * @param companyId the company ID
     * @return true if related production orders exist
     */
    private boolean hasRelatedProductionOrders(Long companyId) {
        String jpql = "SELECT COUNT(po) FROM ProductionOrder po WHERE po.company.id = :companyId";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("companyId", companyId)
                .getSingleResult();
        return count > 0;
    }
}