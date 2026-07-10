package com.spring.boot.service.interfaces;

import com.spring.boot.dto.ProductDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for Product entity.
 */
public interface ProductService {
    ProductDto create(ProductDto productDto);
    ProductDto update(Long id, ProductDto productDto);
    void delete(Long id);
    ProductDto findById(Long id);
    List<ProductDto> findAll();
    Page<ProductDto> findAll(Pageable pageable);
}