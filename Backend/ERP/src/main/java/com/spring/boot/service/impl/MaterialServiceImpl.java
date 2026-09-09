package com.spring.boot.service.impl;

import com.spring.boot.dto.MaterialDto;
import com.spring.boot.mapper.MaterialMapper;
import com.spring.boot.model.Material;
import com.spring.boot.repo.MaterialRepository;
import com.spring.boot.service.interfaces.MaterialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for Material entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;
    private final MessageSource messageSource;

    private String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, key, locale);
    }

    @Override
    public MaterialDto create(MaterialDto materialDto) {
        log.info("Creating new material with name: {}", materialDto.getName());

        // Validate required fields
        if (materialDto.getName() == null || materialDto.getName().trim().isEmpty()) {
            throw new RuntimeException(getMessage("Material.name.is.required"));
        }

        if (materialDto.getType() == null) {
            throw new RuntimeException(getMessage("Material.type.is.required"));
        }

        if (materialDto.getUnit() == null) {
            throw new RuntimeException(getMessage("Material.unit.is.required"));
        }

        // Validate name length
        if (materialDto.getName().length() < 2) {
            throw new RuntimeException(getMessage("Material.name.min.length"));
        }
        if (materialDto.getName().length() > 100) {
            throw new RuntimeException(getMessage("Material.name.max.length"));
        }



        // Check for duplicate material name
        validateMaterialNameIsUnique(null, materialDto.getName());

        Material material = materialMapper.toEntity(materialDto);
        Material savedMaterial = materialRepository.save(material);
        log.info("Material created successfully with id: {}", savedMaterial.getId());
        return materialMapper.toDto(savedMaterial);
    }

    @Override
    public MaterialDto update(Long id, MaterialDto materialDto) {
        log.info("Updating material with id: {}", id);

        Material existing = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Material.not.found.with.id") + id));

        // Validate and update name
        if (materialDto.getName() != null && !materialDto.getName().trim().isEmpty()) {
            if (materialDto.getName().length() < 2) {
                throw new RuntimeException(getMessage("Material.name.min.length"));
            }
            if (materialDto.getName().length() > 100) {
                throw new RuntimeException(getMessage("Material.name.max.length"));
            }
            validateMaterialNameIsUnique(id, materialDto.getName());
            existing.setName(materialDto.getName().trim());
        }

        // Validate and update type
        if (materialDto.getType() != null ) {

            existing.setType(materialDto.getType());
        }

        // Validate and update unit
        if (materialDto.getUnit() != null) {

            existing.setUnit(materialDto.getUnit());
        }


        Material updatedMaterial = materialRepository.save(existing);
        log.info("Material updated successfully with id: {}", updatedMaterial.getId());
        return materialMapper.toDto(updatedMaterial);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting material with id: {}", id);

        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Material.not.found.with.id") + id));

        // Check if material has related data
        if (hasRelatedProducts(id) || hasRelatedProductionOrders(id)) {
            throw new RuntimeException(getMessage("Material.cannot.delete.has.related"));
        }

        materialRepository.deleteById(id);
        log.info("Material deleted successfully with id: {}", id);
    }

    @Override
    public MaterialDto findById(Long id) {
        log.info("Fetching material with id: {}", id);
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Material.not.found.with.id") + id));
        log.info("Material found: {}", material.getName());
        return materialMapper.toDto(material);
    }

    @Override
    public List<MaterialDto> findAll() {
        log.info("Fetching all materials");
        List<MaterialDto> materials = materialRepository.findAll().stream()
                .map(materialMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} materials", materials.size());
        return materials;
    }

    @Override
    public Page<MaterialDto> findAll(Pageable pageable) {
        log.info("Fetching paginated materials with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<MaterialDto> materials = materialRepository.findAll(pageable)
                .map(materialMapper::toDto);
        log.info("Found {} materials (total pages: {}, total elements: {})",
                materials.getContent().size(),
                materials.getTotalPages(),
                materials.getTotalElements());
        return materials;
    }

    // ===== Helper Methods =====

    private void validateMaterialNameIsUnique(Long id, String materialName) {
        if (materialName == null || materialName.trim().isEmpty()) {
            throw new RuntimeException(getMessage("Material.name.is.required"));
        }

        Optional<Material> exists;
        if (id != null) {
            exists = materialRepository.existsByNameAndIdNot(materialName.trim(), id);
        } else {
            exists = materialRepository.existsByName(materialName.trim());
        }

        if (exists.isPresent()) {
            throw new RuntimeException(getMessage("Material.name.already.exists") + materialName);
        }
    }

    private boolean hasRelatedProducts(Long materialId) {
        // Implement based on your entity relationships
        // Example: return productRepository.existsByMaterialId(materialId);
        return false; // Placeholder - implement as needed
    }

    private boolean hasRelatedProductionOrders(Long materialId) {
        // Implement based on your entity relationships
        // Example: return productionOrderRepository.existsByMaterialId(materialId);
        return false; // Placeholder - implement as needed
    }
}