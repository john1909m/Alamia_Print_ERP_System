package com.spring.boot.repo;

import com.spring.boot.model.Paper;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Paper entity.
 */
public interface PaperRepository extends JpaRepository<Paper, Long> {
}