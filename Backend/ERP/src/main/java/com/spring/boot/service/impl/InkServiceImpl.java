package com.spring.boot.service.impl;

import com.spring.boot.dto.InkDto;
import com.spring.boot.mapper.InkMapper;
import com.spring.boot.model.Ink;
import com.spring.boot.repo.InkRepository;
import com.spring.boot.service.interfaces.InkService;
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
 * Service implementation for Ink entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InkServiceImpl implements InkService {

    private final InkRepository inkRepository;
    private final InkMapper inkMapper;
    private final MessageSource messageSource;

    private String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, key, locale);
    }

    @Override
    public InkDto create(InkDto inkDto) {
        log.info("Creating new ink");

        // Validate required fields
        if (inkDto.getMaterialId() == null) {
            throw new RuntimeException(getMessage("Ink.material.is.required"));
        }

        

        if (inkDto.getStock() == null || inkDto.getStock() < 0) {
            throw new RuntimeException(getMessage("Ink.stock.is.required"));
        }


        // Validate type (optional)
        if (inkDto.getInkType() != null && inkDto.getInkType().length() > 50) {
            throw new RuntimeException(getMessage("Ink.type.max.length"));
        }


       // Check for duplicate ink (same material + color)
//        if (inkRepository.existsByMaterialIdAndColor(
//                inkDto.getMaterialId(),
//                inkDto.getColor().trim()
//        )) {
//            throw new RuntimeException(getMessage("Ink.duplicate.exists"));
//        }

        Ink ink = inkMapper.toEntity(inkDto);
        Ink savedInk = inkRepository.save(ink);
        log.info("Ink created successfully with id: {}", savedInk.getId());
        return inkMapper.toDto(savedInk);
    }

    @Override
    public InkDto update(Long id, InkDto inkDto) {
        log.info("Updating ink with id: {}", id);

        Ink existing = inkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Ink.not.found.with.id") + id));





        // Validate and update stock
        if (inkDto.getStock() != null) {
            if (inkDto.getStock() < 0) {
                throw new RuntimeException(getMessage("Ink.stock.invalid"));
            }
            existing.setStock(inkDto.getStock());
        }

        // Validate and update type
        if (inkDto.getInkType() != null) {
            if (inkDto.getInkType().length() > 50) {
                throw new RuntimeException(getMessage("Ink.type.max.length"));
            }
            existing.setInkType(inkDto.getInkType().trim());
        }




        Ink updatedInk = inkRepository.save(existing);
        log.info("Ink updated successfully with id: {}", updatedInk.getId());
        return inkMapper.toDto(updatedInk);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting ink with id: {}", id);

        Ink ink = inkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Ink.not.found.with.id") + id));

        // Check if ink has related production orders
        if (hasRelatedProductionOrders(id)) {
            throw new RuntimeException(getMessage("Ink.cannot.delete.has.related.orders"));
        }

        inkRepository.deleteById(id);
        log.info("Ink deleted successfully with id: {}", id);
    }

    @Override
    public InkDto findById(Long id) {
        log.info("Fetching ink with id: {}", id);
        Ink ink = inkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Ink.not.found.with.id") + id));
        log.info("Ink found");
        return inkMapper.toDto(ink);
    }

    @Override
    public List<InkDto> findAll() {
        log.info("Fetching all inks");
        List<InkDto> inks = inkRepository.findAll().stream()
                .map(inkMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} inks", inks.size());
        return inks;
    }

    @Override
    public Page<InkDto> findAll(Pageable pageable) {
        log.info("Fetching paginated inks with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<InkDto> inks = inkRepository.findAll(pageable)
                .map(inkMapper::toDto);
        log.info("Found {} inks (total pages: {}, total elements: {})",
                inks.getContent().size(),
                inks.getTotalPages(),
                inks.getTotalElements());
        return inks;
    }

    @Override
    public Void adjustStock(Long id, String operation, Double number) {
        log.info("Adjusting stock for ink with id: {}, operation: {}, number: {}", id, operation, number);

        // Validate operation
        if (operation == null || operation.trim().isEmpty()) {
            throw new RuntimeException(getMessage("Ink.stock.operation.is.required"));
        }

        // Validate number
        if (number == null || number <= 0) {
            throw new RuntimeException(getMessage("Ink.stock.number.invalid"));
        }

        Ink existing = inkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Ink.not.found.with.id") + id));

        Double currentStock = existing.getStock();
        if (currentStock == null) {
            currentStock = 0.0;
        }

        switch (operation.toLowerCase()) {
            case "deduct":
                if (currentStock < number) {
                    throw new RuntimeException(getMessage("Ink.stock.insufficient") +
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
                throw new RuntimeException(getMessage("Ink.stock.operation.invalid") + operation);
        }

        inkRepository.save(existing);
        log.info("Stock adjusted successfully for ink with id: {}", id);
        return null;
    }

    // ===== Helper Methods =====

    private boolean hasRelatedProductionOrders(Long inkId) {
        // Implement based on your entity relationships
        // Example: return productionOrderRepository.existsByInkId(inkId);
        return false; // Placeholder - implement as needed
    }
}