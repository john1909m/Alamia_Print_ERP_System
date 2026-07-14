package com.spring.boot.repo;

import com.spring.boot.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for Material entity.
 */
public interface MaterialRepository extends JpaRepository<Material, Long> {
    Optional<Material> existsByNameAndIdNot(String materialName,Long id);
}