package com.spring.boot.service.impl;

import com.spring.boot.dto.PaperDto;
import com.spring.boot.mapper.PaperMapper;
import com.spring.boot.model.Paper;
import com.spring.boot.repo.PaperRepository;
import com.spring.boot.service.interfaces.PaperService;
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
 * Service implementation for Paper entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaperServiceImpl implements PaperService {

    private final PaperRepository paperRepository;
    private final PaperMapper paperMapper;
    private final MessageSource messageSource;

    private String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, key, locale);
    }

    @Override
    @CacheEvict(value = "papers", allEntries = true)
    public PaperDto create(PaperDto paperDto) {
        log.info("Creating new paper");

        // Validate required fields
        if (paperDto.getMaterialId() == null) {
            throw new RuntimeException(getMessage("Paper.material.is.required"));
        }

        if (paperDto.getWidth() == null || paperDto.getWidth() <= 0) {
            throw new RuntimeException(getMessage("Paper.width.is.required"));
        }

        if (paperDto.getHeight() == null || paperDto.getHeight() <= 0) {
            throw new RuntimeException(getMessage("Paper.height.is.required"));
        }

        if (paperDto.getWeight() == null || paperDto.getWeight() <= 0) {
            throw new RuntimeException(getMessage("Paper.weight.is.required"));
        }

        if (paperDto.getStock() == null || paperDto.getStock() < 0) {
            throw new RuntimeException(getMessage("Paper.stock.is.required"));
        }

        // Validate dimensions range
        if (paperDto.getWidth() < 1 || paperDto.getWidth() > 200) {
            throw new RuntimeException(getMessage("Paper.width.invalid.range"));
        }
        if (paperDto.getHeight() < 1 || paperDto.getHeight() > 200) {
            throw new RuntimeException(getMessage("Paper.height.invalid.range"));
        }

        // Validate weight range
        if (paperDto.getWeight() < 40 || paperDto.getWeight() > 500) {
            throw new RuntimeException(getMessage("Paper.weight.invalid.range"));
        }

        // Validate stock
        if (paperDto.getStock() < 0) {
            throw new RuntimeException(getMessage("Paper.stock.invalid"));
        }

//        // Check for duplicate paper (same material, width, height, weight)
//        if (paperRepository.existsByMaterialIdAndWidthAndHeightAndGram(
//                paperDto.getMaterialId(),
//                paperDto.getWidth(),
//                paperDto.getHeight(),
//                paperDto.getWeight()
//        )) {
//            throw new RuntimeException(getMessage("Paper.duplicate.exists"));
//        }

        Paper paper = paperMapper.toEntity(paperDto);
        Paper savedPaper = paperRepository.save(paper);
        log.info("Paper created successfully with id: {}", savedPaper.getId());
        return paperMapper.toDto(savedPaper);
    }

    @Override
    @CacheEvict(value = "papers", allEntries = true)
    public PaperDto update(Long id, PaperDto paperDto) {
        log.info("Updating paper with id: {}", id);

        Paper existing = paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Paper.not.found.with.id") + id));


        // Validate and update width
        if (paperDto.getWidth() != null) {
            if (paperDto.getWidth() <= 0) {
                throw new RuntimeException(getMessage("Paper.width.is.required"));
            }
            if (paperDto.getWidth() < 1 || paperDto.getWidth() > 200) {
                throw new RuntimeException(getMessage("Paper.width.invalid.range"));
            }
            existing.setWidth(paperDto.getWidth());
        }

        // Validate and update height
        if (paperDto.getHeight() != null) {
            if (paperDto.getHeight() <= 0) {
                throw new RuntimeException(getMessage("Paper.height.is.required"));
            }
            if (paperDto.getHeight() < 1 || paperDto.getHeight() > 200) {
                throw new RuntimeException(getMessage("Paper.height.invalid.range"));
            }
            existing.setHeight(paperDto.getHeight());
        }

        // Validate and update weight
        if (paperDto.getWeight() != null) {
            if (paperDto.getWeight() <= 0) {
                throw new RuntimeException(getMessage("Paper.weight.is.required"));
            }
            if (paperDto.getWeight() < 40 || paperDto.getWeight() > 500) {
                throw new RuntimeException(getMessage("Paper.weight.invalid.range"));
            }
            existing.setWeight(paperDto.getWeight());
        }

        // Validate and update stock
        if (paperDto.getStock() != null) {
            if (paperDto.getStock() < 0) {
                throw new RuntimeException(getMessage("Paper.stock.invalid"));
            }
            existing.setStock(paperDto.getStock());
        }

        // Check for duplicate if any of these fields changed
        if (paperDto.getMaterialId() != null || paperDto.getWidth() != null ||
                paperDto.getHeight() != null || paperDto.getWeight() != null) {
//            Long materialId = paperDto.getMaterialId() != null ? paperDto.getMaterialId() : existing.getMaterialId();
            Double width = paperDto.getWidth() != null ? paperDto.getWidth() : existing.getWidth();
            Double height = paperDto.getHeight() != null ? paperDto.getHeight() : existing.getHeight();
            Double weight = paperDto.getWeight() != null ? paperDto.getWeight() : existing.getWeight();

//            boolean exists = paperRepository.existsByMaterialIdAndWidthAndHeightAndGramAndIdNot(
//                    materialId,
//                    width,
//                    height,
//                    weight,
//                    id
//            );
//            if (exists) {
//                throw new RuntimeException(getMessage("Paper.duplicate.exists"));
//            }
        }

        Paper updatedPaper = paperRepository.save(existing);
        log.info("Paper updated successfully with id: {}", updatedPaper.getId());
        return paperMapper.toDto(updatedPaper);
    }

    @Override
    @CacheEvict(value = "papers", key = "#id")
    public void delete(Long id) {
        log.info("Deleting paper with id: {}", id);

        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Paper.not.found.with.id") + id));

        // Check if paper has related production orders
        if (hasRelatedProductionOrders(id)) {
            throw new RuntimeException(getMessage("Paper.cannot.delete.has.related.orders"));
        }

        paperRepository.deleteById(id);
        log.info("Paper deleted successfully with id: {}", id);
    }

    @Override
    @Cacheable(value = "papers",key = "#id")
    public PaperDto findById(Long id) {
        log.info("Fetching paper with id: {}", id);
        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Paper.not.found.with.id") + id));
        log.info("Paper found");
        return paperMapper.toDto(paper);
    }

    @Override
    @Cacheable(value = "papers")
    public List<PaperDto> findAll() {
        log.info("Fetching all papers");
        List<PaperDto> papers = paperRepository.findAll().stream()
                .map(paperMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} papers", papers.size());
        return papers;
    }

    @Override
    public Page<PaperDto> findAll(Pageable pageable) {
        log.info("Fetching paginated papers with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<PaperDto> papers = paperRepository.findAll(pageable)
                .map(paperMapper::toDto);
        log.info("Found {} papers (total pages: {}, total elements: {})",
                papers.getContent().size(),
                papers.getTotalPages(),
                papers.getTotalElements());
        return papers;
    }

    @Override
    public Void adjustStock(Long id, String operation, Double number) {
        log.info("Adjusting stock for paper with id: {}, operation: {}, number: {}", id, operation, number);

        // Validate operation
        if (operation == null || operation.trim().isEmpty()) {
            throw new RuntimeException(getMessage("Paper.stock.operation.is.required"));
        }

        // Validate number
        if (number == null || number <= 0) {
            throw new RuntimeException(getMessage("Paper.stock.number.invalid"));
        }

        Paper existing = paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("Paper.not.found.with.id") + id));

        Double currentStock = existing.getStock();
        if (currentStock == null) {
            currentStock = 0.0;
        }

        switch (operation.toLowerCase()) {
            case "deduct":
                if (currentStock < number) {
                    throw new RuntimeException(getMessage("Paper.stock.insufficient") +
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
                throw new RuntimeException(getMessage("Paper.stock.operation.invalid") + operation);
        }

        paperRepository.save(existing);
        log.info("Stock adjusted successfully for paper with id: {}", id);
        return null;
    }

    // ===== Helper Methods =====

    private boolean hasRelatedProductionOrders(Long paperId) {
        // Implement based on your entity relationships
        // Example: return productionOrderRepository.existsByPaperId(paperId);
        return false; // Placeholder - implement as needed
    }
}