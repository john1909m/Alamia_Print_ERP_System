package com.spring.boot.repo;

import com.spring.boot.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Supplier entity.
 */
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}