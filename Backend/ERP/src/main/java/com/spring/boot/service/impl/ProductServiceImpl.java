package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.mapper.ProductMapper;
import com.spring.boot.model.Product;
import com.spring.boot.repo.ProductRepository;
import com.spring.boot.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
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
    private final MessageSource messageSource;

    private String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, key, locale);
    }

    @Override
    public ProductDto create(ProductDto productDto) {
        log.info("Creating new product with name: {}", productDto.getName());

        // Validate required fields
        if (productDto.getName() == null || productDto.getName().trim().isEmpty()) {
            throw new RuntimeException(getMessage("Product.name.is.required"));
        }

        if (productDto.getCompanyId() == null) {
            throw new RuntimeException(getMessage("Product.company.is.required"));
        }

        if (productDto.getWidth() == null || productDto.getWidth() <= 0) {
            throw new RuntimeException(getMessage("Product.width.is.required"));
        }

        if (productDto.getHeight() == null || productDto.getHeight() <= 0) {
            throw new RuntimeException(getMessage("Product.height.is.required"));
        }

        // Validate name length
        if (productDto.getName().length() < 2) {
            throw new RuntimeException(getMessage("Product.name.min.length"));
        }
        if (productDto.getName().length() > 100) {
            throw new RuntimeException(getMessage("Product.name.max.length"));
        }

        // Validate dimensions
        if (productDto.getWidth() < 1 || productDto.getWidth() > 100) {
            throw new RuntimeException(getMessage("Product.width.invalid.range"));
        }
        if (productDto.getHeight() < 1 || productDto.getHeight() > 100) {
            throw new RuntimeException(getMessage("Product.height.invalid.range"));
        }



        Product product = productMapper.toEntity(productDto);
        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with id: {}", savedProduct.getId());
        return productMapper.toDto(savedProduct);
    }

    @Override
    public ProductDto update(Long id, ProductDto productDto) {
        log.info("Updating product with id: {}", id);

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Product.not.found.with.id") + id));

        // Validate and update name
        if (productDto.getName() != null && !productDto.getName().trim().isEmpty()) {
            if (productDto.getName().length() < 2) {
                throw new RuntimeException(getMessage("Product.name.min.length"));
            }
            if (productDto.getName().length() > 100) {
                throw new RuntimeException(getMessage("Product.name.max.length"));
            }
            // Check duplicate name within same company
            Long companyId = productDto.getCompanyId() != null ? productDto.getCompanyId() : existing.getCompany().getId();

            existing.setName(productDto.getName().trim());
        }

        // Validate and update company
        if (productDto.getCompanyId() != null) {
            existing.setCompany(null); // Will be set by mapper or handled separately

        }

        // Validate and update dimensions
        if (productDto.getWidth() != null) {
            if (productDto.getWidth() <= 0) {
                throw new RuntimeException(getMessage("Product.width.is.required"));
            }
            if (productDto.getWidth() < 1 || productDto.getWidth() > 100) {
                throw new RuntimeException(getMessage("Product.width.invalid.range"));
            }
            existing.setWidth(productDto.getWidth());
        }

        if (productDto.getHeight() != null) {
            if (productDto.getHeight() <= 0) {
                throw new RuntimeException(getMessage("Product.height.is.required"));
            }
            if (productDto.getHeight() < 1 || productDto.getHeight() > 100) {
                throw new RuntimeException(getMessage("Product.height.invalid.range"));
            }
            existing.setHeight(productDto.getHeight());
        }



        Product updatedProduct = productRepository.save(existing);
        log.info("Product updated successfully with id: {}", updatedProduct.getId());
        return productMapper.toDto(updatedProduct);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting product with id: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Product.not.found.with.id") + id));

        // Check if product has related production orders
        if (hasRelatedProductionOrders(id)) {
            throw new RuntimeException(getMessage("Product.cannot.delete.has.related.orders"));
        }

        productRepository.deleteById(id);
        log.info("Product deleted successfully with id: {}", id);
    }

    @Override
    public ProductDto findById(Long id) {
        log.info("Fetching product with id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Product.not.found.with.id") + id));
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

    // ===== Helper Methods =====

    private boolean hasRelatedProductionOrders(Long productId) {
        // Implement based on your entity relationships
        // Example: return productionOrderRepository.existsByProductId(productId);
        return false; // Placeholder - implement as needed
    }
}