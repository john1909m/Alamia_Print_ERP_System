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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final MessageSource messageSource;

    @PersistenceContext
    private EntityManager entityManager;

    private String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, key, locale);
    }

    @Override
    @Transactional
    @CacheEvict(value = "companies", allEntries = true)
    public CompanyDto create(CompanyDto companyDto) {
        log.info("Creating new company with name: {}", companyDto.getName());

        if (companyDto.getName() == null || companyDto.getName().trim().isEmpty()) {
            throw new RuntimeException(getMessage("Company.name.is.required"));
        }

        validateDuplicateName(companyDto.getName(), null);
        Company company = companyMapper.toEntity(companyDto);
        Company savedCompany = companyRepository.save(company);
        log.info("Company created successfully with id: {}", savedCompany.getId());
        return companyMapper.toDto(savedCompany);
    }

    @Override
    @Transactional
    @CacheEvict(value = "companies", allEntries = true)
    public CompanyDto update(Long id, CompanyDto companyDto) {
        log.info("Updating company with id: {}", id);
        Company existingCompany = findCompanyOrThrow(id);

        if (companyDto.getId() == null) {
            companyDto.setId(id);
        }

        String currentName = existingCompany.getName();
        String newName = companyDto.getName();

        if (newName == null || newName.trim().isEmpty()) {
            throw new RuntimeException(getMessage("Company.name.is.required"));
        }

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
    @CacheEvict(value = "companies", key = "#id")
    public void delete(Long id) {
        log.info("Deleting company with id: {}", id);
        Company company = findCompanyOrThrow(id);
        validateDelete(company.getId());
        companyRepository.deleteById(id);
        log.info("Company deleted successfully with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "companies", key = "#id")
    public CompanyDto findById(Long id) {
        log.info("Fetching company with id: {}", id);
        Company company = findCompanyOrThrow(id);
        log.info("Company found: {}", company.getName());
        return companyMapper.toDto(company);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "companies")
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
//    @Cacheable(value = "companies", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
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

    private Company findCompanyOrThrow(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Company.not.found.with.id") + id));
    }

    private void validateDuplicateName(String name, Long excludeId) {
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
            throw new RuntimeException(getMessage("Company.name.already.exists") + name);
        }
    }

    private void validateDelete(Long companyId) {
        boolean hasRelatedProducts = hasRelatedProducts(companyId);
        boolean hasRelatedProductionOrders = hasRelatedProductionOrders(companyId);
        if (hasRelatedProducts || hasRelatedProductionOrders) {
            throw new RuntimeException(getMessage("Company.cannot.delete.has.related"));
        }
    }

    private boolean hasRelatedProducts(Long companyId) {
        String jpql = "SELECT COUNT(p) FROM Product p WHERE p.company.id = :companyId";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("companyId", companyId)
                .getSingleResult();
        return count > 0;
    }

    private boolean hasRelatedProductionOrders(Long companyId) {
        String jpql = "SELECT COUNT(po) FROM ProductionOrder po WHERE po.company.id = :companyId";
        Long count = entityManager.createQuery(jpql, Long.class)
                .setParameter("companyId", companyId)
                .getSingleResult();
        return count > 0;
    }
}