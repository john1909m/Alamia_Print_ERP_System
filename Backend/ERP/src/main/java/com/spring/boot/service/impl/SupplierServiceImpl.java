package com.spring.boot.service.impl;

import com.spring.boot.dto.SupplierDto;
import com.spring.boot.mapper.SupplierMapper;
import com.spring.boot.model.Supplier;
import com.spring.boot.repo.SupplierRepository;
import com.spring.boot.service.interfaces.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
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
    private final MessageSource messageSource;

    private String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, key, locale);
    }

    @Override
    @CacheEvict(value = "suppliers", allEntries = true)
    public SupplierDto create(SupplierDto supplierDto) {
        log.info("Creating new supplier with name: {}", supplierDto.getName());

        // Validate required fields
        if (supplierDto.getName() == null || supplierDto.getName().trim().isEmpty()) {
            throw new RuntimeException(getMessage("Supplier.name.is.required"));
        }

        if (supplierDto.getPhone() == null || supplierDto.getPhone().trim().isEmpty()) {
            throw new RuntimeException(getMessage("Supplier.phone.is.required"));
        }

        if (supplierDto.getEmail() == null || supplierDto.getEmail().trim().isEmpty()) {
            throw new RuntimeException(getMessage("Supplier.email.is.required"));
        }

        // Validate name length
        if (supplierDto.getName().length() < 2) {
            throw new RuntimeException(getMessage("Supplier.name.min.length"));
        }
        if (supplierDto.getName().length() > 100) {
            throw new RuntimeException(getMessage("Supplier.name.max.length"));
        }

        // Validate phone number
        String phone = supplierDto.getPhone().replaceAll("[\\s-]", "");
        if (!isValidPhoneNumber(phone)) {
            throw new RuntimeException(getMessage("Supplier.phone.invalid.format"));
        }

        // Validate email
        if (!isValidEmail(supplierDto.getEmail())) {
            throw new RuntimeException(getMessage("Supplier.email.invalid.format"));
        }

        // Check if email already exists
        if (supplierRepository.existsByEmail(supplierDto.getEmail())) {
            throw new RuntimeException(getMessage("Supplier.email.already.exists"));
        }

        // Validate address (optional)
        if (supplierDto.getAddress() != null && supplierDto.getAddress().length() > 200) {
            throw new RuntimeException(getMessage("Supplier.address.max.length"));
        }

        Supplier supplier = supplierMapper.toEntity(supplierDto);
        Supplier savedSupplier = supplierRepository.save(supplier);
        log.info("Supplier created successfully with id: {}", savedSupplier.getId());
        return supplierMapper.toDto(savedSupplier);
    }

    @Override
    @CacheEvict(value = "suppliers", allEntries = true)
    public SupplierDto update(Long id, SupplierDto supplierDto) {
        log.info("Updating supplier with id: {}", id);

        Supplier existing = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Supplier.not.found.with.id") + id));

        // Validate name if provided
        if (supplierDto.getName() != null && !supplierDto.getName().trim().isEmpty()) {
            if (supplierDto.getName().length() < 2) {
                throw new RuntimeException(getMessage("Supplier.name.min.length"));
            }
            if (supplierDto.getName().length() > 100) {
                throw new RuntimeException(getMessage("Supplier.name.max.length"));
            }
            existing.setName(supplierDto.getName().trim());
        }

        // Validate phone if provided
        if (supplierDto.getPhone() != null && !supplierDto.getPhone().trim().isEmpty()) {
            String phone = supplierDto.getPhone().replaceAll("[\\s-]", "");
            if (!isValidPhoneNumber(phone)) {
                throw new RuntimeException(getMessage("Supplier.phone.invalid.format"));
            }
            existing.setPhone(supplierDto.getPhone().trim());
        }

        // Validate email if provided
        if (supplierDto.getEmail() != null && !supplierDto.getEmail().trim().isEmpty()) {
            String email = supplierDto.getEmail().trim().toLowerCase();
            if (!isValidEmail(email)) {
                throw new RuntimeException(getMessage("Supplier.email.invalid.format"));
            }
            // Check if email is used by another supplier
            Supplier existingWithEmail = supplierRepository.findByEmail(email).orElse(null);
            if (existingWithEmail != null && !existingWithEmail.getId().equals(id)) {
                throw new RuntimeException(getMessage("Supplier.email.already.exists"));
            }
            existing.setEmail(email);
        }

        // Validate address if provided
        if (supplierDto.getAddress() != null) {
            if (supplierDto.getAddress().length() > 200) {
                throw new RuntimeException(getMessage("Supplier.address.max.length"));
            }
            existing.setAddress(supplierDto.getAddress().trim());
        }

        Supplier updatedSupplier = supplierRepository.save(existing);
        log.info("Supplier updated successfully with id: {}", updatedSupplier.getId());
        return supplierMapper.toDto(updatedSupplier);
    }

    @Override
    @CacheEvict(value = "suppliers", key = "#id")
    public void delete(Long id) {
        log.info("Deleting supplier with id: {}", id);

        Supplier existing = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Supplier.not.found.with.id") + id));

        // Check if supplier has related data
        if (hasRelatedProducts(id)) {
            throw new RuntimeException(getMessage("Supplier.cannot.delete.has.related.products"));
        }

        supplierRepository.deleteById(id);
        log.info("Supplier deleted successfully with id: {}", id);
    }

    @Override
    @Cacheable(value = "suppliers",key = "#id")
    public SupplierDto findById(Long id) {
        log.info("Fetching supplier with id: {}", id);
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Supplier.not.found.with.id") + id));
        log.info("Supplier found: {}", supplier.getName());
        return supplierMapper.toDto(supplier);
    }

    @Override
    @Cacheable(value = "suppliers")
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

    // ===== Helper Validation Methods =====

    private boolean isValidPhoneNumber(String phone) {
        if (phone == null) return false;
        String phoneRegex = "^(\\+20|0)?1[0125]\\d{8}$";
        return phone.matches(phoneRegex);
    }

    private boolean isValidEmail(String email) {
        if (email == null) return false;
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    private boolean hasRelatedProducts(Long supplierId) {
        // Implement based on your entity relationships
        // Example: return productRepository.existsBySupplierId(supplierId);
        return false; // Placeholder - implement as needed
    }
}