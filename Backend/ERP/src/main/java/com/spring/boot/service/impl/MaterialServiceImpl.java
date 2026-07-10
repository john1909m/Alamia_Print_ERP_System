package com.spring.boot.service.impl;

import com.spring.boot.dto.MaterialDto;
import com.spring.boot.mapper.MaterialMapper;
import com.spring.boot.model.Material;
import com.spring.boot.repo.MaterialRepository;
import com.spring.boot.service.interfaces.MaterialService;
import com.spring.boot.exception.ResourceNotFoundException;
import com.spring.boot.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * Service implementation for Material entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;

    @Override
    public MaterialDto create(MaterialDto materialDto) {
        log.info("Creating new material with name: {}", materialDto.getName());
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
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));
        validateMaterialNameIsUnique(id, materialDto.getName());
        Material materialToUpdate = materialMapper.toEntity(materialDto);
        materialToUpdate.setId(existing.getId());
        Material updatedMaterial = materialRepository.save(materialToUpdate);
        log.info("Material updated successfully with id: {}", updatedMaterial.getId());
        return materialMapper.toDto(updatedMaterial);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting material with id: {}", id);
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));
        materialRepository.deleteById(id);
        log.info("Material deleted successfully with id: {}", id);
    }

    @Override
    public MaterialDto findById(Long id) {
        log.info("Fetching material with id: {}", id);
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));
        log.info("Material found: {}", material.getName());
        return materialMapper.toDto(material);
    }

    @Override
    public java.util.List<MaterialDto> findAll() {
        log.info("Fetching all materials");
        java.util.List<MaterialDto> materials = materialRepository.findAll().stream()
                .map(materialMapper::toDto)
                .collect(java.util.stream.Collectors.toList());
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

    /**
     * Validates that the material name is unique (case-sensitive).
     * Excludes the material with the given id (if any) from the check.
     *
     * @param id          the material id to exclude from the check (null for create)
     * @param materialName the material name to validate
     */
    private void validateMaterialNameIsUnique(Long id, String materialName) {
        if (materialRepository.existsByNameAndIdNot(materialName, id)) {
            throw new BadRequestException("Material with name '" + materialName + "' already exists");
        }
    }
}