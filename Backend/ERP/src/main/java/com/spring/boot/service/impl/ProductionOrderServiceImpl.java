package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductionOrderDto;
import com.spring.boot.mapper.ProductionOrderMapper;
import com.spring.boot.model.ProductionOrder;
import com.spring.boot.repo.ProductionOrderRepository;
import com.spring.boot.service.interfaces.ProductionOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for ProductionOrder entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductionOrderServiceImpl implements ProductionOrderService {

    private final ProductionOrderRepository productionOrderRepository;
    private final ProductionOrderMapper productionOrderMapper;

    @Override
    public ProductionOrderDto create(ProductionOrderDto productionOrderDto) {
        log.info("Creating new production order with ID: {}", productionOrderDto.getId());
        ProductionOrder productionOrder = productionOrderMapper.toEntity(productionOrderDto);
        ProductionOrder savedProductionOrder = productionOrderRepository.save(productionOrder);
        log.info("Production order created successfully with id: {}", savedProductionOrder.getId());
        return productionOrderMapper.toDto(savedProductionOrder);
    }

    @Override
    public ProductionOrderDto update(Long id, ProductionOrderDto productionOrderDto) {
        log.info("Updating production order with id: {}", id);
        ProductionOrder existing = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production order not found with id: " + id));
        ProductionOrder productionOrderToUpdate = productionOrderMapper.toEntity(productionOrderDto);
        productionOrderToUpdate.setId(existing.getId());
        ProductionOrder updatedProductionOrder = productionOrderRepository.save(productionOrderToUpdate);
        log.info("Production order updated successfully with id: {}", updatedProductionOrder.getId());
        return productionOrderMapper.toDto(updatedProductionOrder);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting production order with id: {}", id);
        productionOrderRepository.deleteById(id);
        log.info("Production order deleted successfully with id: {}", id);
    }

    @Override
    public ProductionOrderDto findById(Long id) {
        log.info("Fetching production order with id: {}", id);
        ProductionOrder productionOrder = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production order not found with id: " + id));
        log.info("Production order found with id: {}", productionOrder.getId());
        return productionOrderMapper.toDto(productionOrder);
    }

    @Override
    public List<ProductionOrderDto> findAll() {
        log.info("Fetching all production orders");
        List<ProductionOrderDto> productionOrders = productionOrderRepository.findAll().stream()
                .map(productionOrderMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} production orders", productionOrders.size());
        return productionOrders;
    }

    @Override
    public Page<ProductionOrderDto> findAll(Pageable pageable) {
        log.info("Fetching paginated production orders with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<ProductionOrderDto> productionOrders = productionOrderRepository.findAll(pageable)
                .map(productionOrderMapper::toDto);
        log.info("Found {} production orders (total pages: {}, total elements: {})",
                productionOrders.getContent().size(),
                productionOrders.getTotalPages(),
                productionOrders.getTotalElements());
        return productionOrders;
    }
}