package com.spring.boot.repo;

import com.spring.boot.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Product entity.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {
}