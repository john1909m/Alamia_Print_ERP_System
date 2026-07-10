package com.spring.boot.service.interfaces;

import com.spring.boot.dto.CompanyDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for Company entity.
 */
public interface CompanyService {
    CompanyDto create(CompanyDto companyDto);
    CompanyDto update(Long id, CompanyDto companyDto);
    void delete(Long id);
    CompanyDto findById(Long id);
    List<CompanyDto> findAll();
    Page<CompanyDto> findAll(Pageable pageable);
}