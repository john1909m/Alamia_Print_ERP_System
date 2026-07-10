package com.spring.boot.repo;

import com.spring.boot.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Material entity.
 */
public interface MaterialRepository extends JpaRepository<Material, Long> {
}