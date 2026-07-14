package com.spring.boot.service.interfaces;

import com.spring.boot.dto.SupplierDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


/**
 * Service interface for Supplier entity.
 */
public interface SupplierService {
    SupplierDto create(SupplierDto supplierDto);
    SupplierDto update(Long id, SupplierDto supplierDto);
    void delete(Long id);
    SupplierDto findById(Long id);
    List<SupplierDto> findAll();
    Page<SupplierDto> findAll(Pageable pageable);
}