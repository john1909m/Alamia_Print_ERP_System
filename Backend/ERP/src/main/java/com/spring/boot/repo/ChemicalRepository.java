package com.spring.boot.repo;

import com.spring.boot.model.Chemical;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Chemical entity.
 */
public interface ChemicalRepository extends JpaRepository<Chemical, Long> {
}