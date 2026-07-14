package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.mapper.ProductMapper;
import com.spring.boot.model.Product;
import com.spring.boot.repo.ProductRepository;
import com.spring.boot.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Product entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductDto create(ProductDto productDto) {
        log.info("Creating new product with name: {}", productDto.getName());
        Product product = productMapper.toEntity(productDto);
        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with id: {}", savedProduct.getId());
        return productMapper.toDto(savedProduct);
    }

    @Override
    public ProductDto update(Long id, ProductDto productDto) {
        log.info("Updating product with id: {}", id);
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        Product productToUpdate = productMapper.toEntity(productDto);
        productToUpdate.setId(existing.getId());
        Product updatedProduct = productRepository.save(productToUpdate);
        log.info("Product updated successfully with id: {}", updatedProduct.getId());
        return productMapper.toDto(updatedProduct);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.deleteById(id);
        log.info("Product deleted successfully with id: {}", id);
    }

    @Override
    public ProductDto findById(Long id) {
        log.info("Fetching product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        log.info("Product found: {}", product.getName());
        return productMapper.toDto(product);
    }

    @Override
    public List<ProductDto> findAll() {
        log.info("Fetching all products");
        List<ProductDto> products = productRepository.findAll().stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} products", products.size());
        return products;
    }

    @Override
    public Page<ProductDto> findAll(Pageable pageable) {
        log.info("Fetching paginated products with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<ProductDto> products = productRepository.findAll(pageable)
                .map(productMapper::toDto);
        log.info("Found {} products (total pages: {}, total elements: {})",
                products.getContent().size(),
                products.getTotalPages(),
                products.getTotalElements());
        return products;
    }
}