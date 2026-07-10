package com.spring.boot.service.impl;

import com.spring.boot.dto.SupplierDto;
import com.spring.boot.mapper.SupplierMapper;
import com.spring.boot.model.Supplier;
import com.spring.boot.repo.SupplierRepository;
import com.spring.boot.service.interfaces.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Supplier entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    @Override
    public SupplierDto create(SupplierDto supplierDto) {
        log.info("Creating new supplier with name: {}", supplierDto.getName());
        Supplier supplier = supplierMapper.toEntity(supplierDto);
        Supplier savedSupplier = supplierRepository.save(supplier);
        log.info("Supplier created successfully with id: {}", savedSupplier.getId());
        return supplierMapper.toDto(savedSupplier);
    }

    @Override
    public SupplierDto update(Long id, SupplierDto supplierDto) {
        log.info("Updating supplier with id: {}", id);
        Supplier existing = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        Supplier supplierToUpdate = supplierMapper.toEntity(supplierDto);
        supplierToUpdate.setId(existing.getId());
        Supplier updatedSupplier = supplierRepository.save(supplierToUpdate);
        log.info("Supplier updated successfully with id: {}", updatedSupplier.getId());
        return supplierMapper.toDto(updatedSupplier);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting supplier with id: {}", id);
        supplierRepository.deleteById(id);
        log.info("Supplier deleted successfully with id: {}", id);
    }

    @Override
    public SupplierDto findById(Long id) {
        log.info("Fetching supplier with id: {}", id);
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        log.info("Supplier found: {}", supplier.getName());
        return supplierMapper.toDto(supplier);
    }

    @Override
    public List<SupplierDto> findAll() {
        log.info("Fetching all suppliers");
        List<SupplierDto> suppliers = supplierRepository.findAll().stream()
                .map(supplierMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} suppliers", suppliers.size());
        return suppliers;
    }

    @Override
    public Page<SupplierDto> findAll(Pageable pageable) {
        log.info("Fetching paginated suppliers with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<SupplierDto> suppliers = supplierRepository.findAll(pageable)
                .map(supplierMapper::toDto);
        log.info("Found {} suppliers (total pages: {}, total elements: {})",
                suppliers.getContent().size(),
                suppliers.getTotalPages(),
                suppliers.getTotalElements());
        return suppliers;
    }
}