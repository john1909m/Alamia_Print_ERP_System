package com.spring.boot.repo;

import com.spring.boot.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for Supplier entity.
 */
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Boolean existsByEmail(String email);
    Optional<Supplier> findByEmail(String email);
}