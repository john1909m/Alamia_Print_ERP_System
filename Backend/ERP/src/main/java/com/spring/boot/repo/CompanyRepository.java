package com.spring.boot.repo;

import com.spring.boot.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Company entity.
 */
public interface CompanyRepository extends JpaRepository<Company, Long> {
}