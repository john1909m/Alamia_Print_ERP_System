package com.spring.boot.service.interfaces;

import com.spring.boot.dto.ProductionOrderDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for ProductionOrder entity.
 */
public interface ProductionOrderService {
    ProductionOrderDto create(ProductionOrderDto productionOrderDto);
    ProductionOrderDto update(Long id, ProductionOrderDto productionOrderDto);
    void delete(Long id);
    ProductionOrderDto findById(Long id);
    List<ProductionOrderDto> findAll();
    Page<ProductionOrderDto> findAll(Pageable pageable);
}