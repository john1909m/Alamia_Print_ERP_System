package com.spring.boot.service.impl;

import com.spring.boot.dto.CompanyDto;
import com.spring.boot.mapper.CompanyMapper;
import com.spring.boot.model.Company;
import com.spring.boot.repo.CompanyRepository;
import com.spring.boot.service.interfaces.CompanyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Company entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    @Override
    public CompanyDto create(CompanyDto companyDto) {
        log.info("Creating new company: {}", companyDto.getName());
        Company company = companyMapper.toEntity(companyDto);
        Company savedCompany = companyRepository.save(company);
        log.info("Company created successfully with id: {}", savedCompany.getId());
        return companyMapper.toDto(savedCompany);
    }

    @Override
    public CompanyDto update(Long id, CompanyDto companyDto) {
        log.info("Updating company with id: {}", id);
        Company existing = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        // Update fields from DTO to entity
        Company companyToUpdate = companyMapper.toEntity(companyDto);
        companyToUpdate.setId(existing.getId());
        Company updatedCompany = companyRepository.save(companyToUpdate);
        log.info("Company updated successfully with id: {}", updatedCompany.getId());
        return companyMapper.toDto(updatedCompany);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting company with id: {}", id);
        companyRepository.deleteById(id);
        log.info("Company deleted successfully with id: {}", id);
    }

    @Override
    public CompanyDto findById(Long id) {
        log.info("Fetching company with id: {}", id);
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        log.info("Company found: {}", company.getName());
        return companyMapper.toDto(company);
    }

    @Override
    public List<CompanyDto> findAll() {
        log.info("Fetching all companies");
        List<CompanyDto> companies = companyRepository.findAll().stream()
                .map(companyMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} companies", companies.size());
        return companies;
    }

    @Override
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
}