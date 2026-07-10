package com.spring.boot.repo;

import com.spring.boot.model.Ink;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Ink entity.
 */
public interface InkRepository extends JpaRepository<Ink, Long> {
}