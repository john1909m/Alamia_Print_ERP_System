package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.mapper.ProductMapper;
import com.spring.boot.model.Product;
import com.spring.boot.repo.ProductRepository;
import com.spring.boot.repo.CompanyRepository;
import com.spring.boot.service.interfaces.ProductService;
import com.spring.boot.exception.ResourceNotFoundException;
import com.spring.boot.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * Service implementation for Product entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CompanyRepository companyRepository;

    @Override
    public ProductDto create(ProductDto productDto) {
        log.info("Creating new product with name: {}", productDto.getName());
        Long companyId = extractCompanyId(productDto);
        validateCompanyExists(companyId);
        Product product = productMapper.toEntity(productDto);
        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with id: {}", savedProduct.getId());
        return productMapper.toDto(savedProduct);
    }

    @Override
    public ProductDto update(Long id, ProductDto productDto) {
        log.info("Updating product with id: {}", id);
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        Long companyId = extractCompanyId(productDto);
        validateCompanyExists(companyId);
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
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.deleteById(id);
        log.info("Product deleted successfully with id: {}", id);
    }

    @Override
    public ProductDto findById(Long id) {
        log.info("Fetching product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        log.info("Product found: {}", product.getName());
        return productMapper.toDto(product);
    }

    @Override
    public java.util.List<ProductDto> findAll() {
        log.info("Fetching all products");
        java.util.List<ProductDto> products = productRepository.findAll().stream()
                .map(productMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
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

    /**
     * Extracts the company ID from the product DTO.
     * Assumes the DTO has a companyId field.
     *
     * @param productDto the product DTO
     * @return the company ID
     */
    private Long extractCompanyId(ProductDto productDto) {
        if (productDto == null) {
            return null;
        }
        return productDto.getCompanyId();
    }

    /**
     * Validates that a company with the given ID exists.
     *
     * @param companyId the company ID to validate
     */
    private void validateCompanyExists(Long companyId) {
        if (companyId == null) {
            throw new BadRequestException("Company ID is required");
        }
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company not found with id: " + companyId);
        }
    }
}