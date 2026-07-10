package com.spring.boot.repo;

import com.spring.boot.model.ProductionOrder;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for ProductionOrder entity.
 */
public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, Long> {
}