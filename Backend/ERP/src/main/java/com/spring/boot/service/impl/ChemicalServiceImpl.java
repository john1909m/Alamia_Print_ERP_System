package com.spring.boot.service.impl;

import com.spring.boot.dto.ChemicalDto;
import com.spring.boot.mapper.ChemicalMapper;
import com.spring.boot.model.Chemical;
import com.spring.boot.repo.ChemicalRepository;
import com.spring.boot.service.interfaces.ChemicalService;
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
 * Service implementation for Chemical entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChemicalServiceImpl implements ChemicalService {

    private final ChemicalRepository chemicalRepository;
    private final ChemicalMapper chemicalMapper;
    private final MessageSource messageSource;

    private String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, key, locale);
    }

    @Override
    public ChemicalDto create(ChemicalDto chemicalDto) {
        log.info("Creating new chemical");


        if (chemicalDto.getChemicalType() == null || chemicalDto.getChemicalType().trim().isEmpty()) {
            throw new RuntimeException(getMessage("Chemical.type.is.required"));
        }

        if (chemicalDto.getStock() == null || chemicalDto.getStock() < 0) {
            throw new RuntimeException(getMessage("Chemical.stock.is.required"));
        }




        // Validate type length
        if (chemicalDto.getChemicalType().length() > 50) {
            throw new RuntimeException(getMessage("Chemical.type.max.length"));
        }


        // Validate stock
        if (chemicalDto.getStock() < 0) {
            throw new RuntimeException(getMessage("Chemical.stock.invalid"));
        }




        Chemical chemical = chemicalMapper.toEntity(chemicalDto);
        Chemical savedChemical = chemicalRepository.save(chemical);
        log.info("Chemical created successfully with id: {}", savedChemical.getId());
        return chemicalMapper.toDto(savedChemical);
    }

    @Override
    public ChemicalDto update(Long id, ChemicalDto chemicalDto) {
        log.info("Updating chemical with id: {}", id);

        Chemical existing = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Chemical.not.found.with.id") + id));

        // Validate and update name


        // Validate and update type
        if (chemicalDto.getChemicalType() != null && !chemicalDto.getChemicalType().trim().isEmpty()) {
            if (chemicalDto.getChemicalType().length() > 50) {
                throw new RuntimeException(getMessage("Chemical.type.max.length"));
            }
            existing.setChemicalType(chemicalDto.getChemicalType().trim());
        }



        // Validate and update stock
        if (chemicalDto.getStock() != null) {
            if (chemicalDto.getStock() < 0) {
                throw new RuntimeException(getMessage("Chemical.stock.invalid"));
            }
            existing.setStock(chemicalDto.getStock());
        }

        // Validate and update description


        // Validate and update price


        Chemical updatedChemical = chemicalRepository.save(existing);
        log.info("Chemical updated successfully with id: {}", updatedChemical.getId());
        return chemicalMapper.toDto(updatedChemical);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting chemical with id: {}", id);

        Chemical chemical = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Chemical.not.found.with.id") + id));

        // Check if chemical has related production orders
        if (hasRelatedProductionOrders(id)) {
            throw new RuntimeException(getMessage("Chemical.cannot.delete.has.related.orders"));
        }

        chemicalRepository.deleteById(id);
        log.info("Chemical deleted successfully with id: {}", id);
    }

    @Override
    public ChemicalDto findById(Long id) {
        log.info("Fetching chemical with id: {}", id);
        Chemical chemical = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Chemical.not.found.with.id") + id));
        log.info("Chemical found: {}", chemical.getChemicalType());
        return chemicalMapper.toDto(chemical);
    }

    @Override
    public List<ChemicalDto> findAll() {
        log.info("Fetching all chemicals");
        List<ChemicalDto> chemicals = chemicalRepository.findAll().stream()
                .map(chemicalMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} chemicals", chemicals.size());
        return chemicals;
    }

    @Override
    public Page<ChemicalDto> findAll(Pageable pageable) {
        log.info("Fetching paginated chemicals with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<ChemicalDto> chemicals = chemicalRepository.findAll(pageable)
                .map(chemicalMapper::toDto);
        log.info("Found {} chemicals (total pages: {}, total elements: {})",
                chemicals.getContent().size(),
                chemicals.getTotalPages(),
                chemicals.getTotalElements());
        return chemicals;
    }

    @Override
    public Void adjustStock(Long id, String operation, Double number) {
        log.info("Adjusting stock for chemical with id: {}, operation: {}, number: {}", id, operation, number);

        // Validate operation
        if (operation == null || operation.trim().isEmpty()) {
            throw new RuntimeException(getMessage("Chemical.stock.operation.is.required"));
        }

        // Validate number
        if (number == null || number <= 0) {
            throw new RuntimeException(getMessage("Chemical.stock.number.invalid"));
        }

        Chemical existing = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Chemical.not.found.with.id") + id));

        Double currentStock = existing.getStock();
        if (currentStock == null) {
            currentStock = 0.0;
        }

        switch (operation.toLowerCase()) {
            case "deduct":
                if (currentStock < number) {
                    throw new RuntimeException(getMessage("Chemical.stock.insufficient") +
                            " Available: " + currentStock + ", Required: " + number);
                }
                existing.setStock(currentStock - number);
                log.info("Stock deducted: {} -> {}", currentStock, existing.getStock());
                break;

            case "refund":
                existing.setStock(currentStock + number);
                log.info("Stock refunded: {} -> {}", currentStock, existing.getStock());
                break;

            case "add":
                existing.setStock(currentStock + number);
                log.info("Stock added: {} -> {}", currentStock, existing.getStock());
                break;

            default:
                throw new RuntimeException(getMessage("Chemical.stock.operation.invalid") + operation);
        }

        chemicalRepository.save(existing);
        log.info("Stock adjusted successfully for chemical with id: {}", id);
        return null;
    }

    // ===== Helper Methods =====

    private boolean hasRelatedProductionOrders(Long chemicalId) {
        // Implement based on your entity relationships
        // Example: return productionOrderRepository.existsByChemicalId(chemicalId);
        return false; // Placeholder - implement as needed
    }
}