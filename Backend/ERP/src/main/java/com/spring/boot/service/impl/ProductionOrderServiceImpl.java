package com.spring.boot.service.impl;

import com.spring.boot.dto.ProductionOrderDto;
import com.spring.boot.enums.ProductionStatus;
import com.spring.boot.mapper.ProductionOrderMapper;
import com.spring.boot.model.Chemical;
import com.spring.boot.model.Ink;
import com.spring.boot.model.ProductionOrder;
import com.spring.boot.repo.*;
import com.spring.boot.service.interfaces.*;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class ProductionOrderServiceImpl implements ProductionOrderService {

    private final ProductionOrderRepository productionOrderRepository;
    private final ProductionOrderMapper productionOrderMapper;
    private final PaperService paperService;
    private final CalculatePapersService calculatePapersService;
    private final InkService inkService;
    private final ChemicalService chemicalService;
    private final InkRepository inkRepository;
    private final PaperRepository paperRepository;
    private final ChemicalRepository chemicalRepository;
    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;
    private final MessageSource messageSource;

    private String getMessage(String key) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(key, null, key, locale);
    }

    @Override
    public ProductionOrderDto create(ProductionOrderDto productionOrderDto) {
        log.info("Creating new production order with description: {}", productionOrderDto.getDescription());

        // Validate required fields
        if (productionOrderDto.getProductId() == null) {
            throw new RuntimeException(getMessage("ProductionOrder.product.is.required"));
        }

        if (productionOrderDto.getCompanyId() == null) {
            throw new RuntimeException(getMessage("ProductionOrder.company.is.required"));
        }

        if (productionOrderDto.getPaperId() == null) {
            throw new RuntimeException(getMessage("ProductionOrder.paper.is.required"));
        }

        if (productionOrderDto.getQuantity() == null || productionOrderDto.getQuantity() <= 0) {
            throw new RuntimeException(getMessage("ProductionOrder.quantity.is.required"));
        }

        if (productionOrderDto.getNumberInMontage() == null || productionOrderDto.getNumberInMontage() <= 0) {
            throw new RuntimeException(getMessage("ProductionOrder.numberInMontage.is.required"));
        }

        // Validate quantity range
        if (productionOrderDto.getQuantity() < 1) {
            throw new RuntimeException(getMessage("ProductionOrder.quantity.min"));
        }
        if (productionOrderDto.getQuantity() > 1000000) {
            throw new RuntimeException(getMessage("ProductionOrder.quantity.max"));
        }

        // Validate number in montage range
        if (productionOrderDto.getNumberInMontage() < 1) {
            throw new RuntimeException(getMessage("ProductionOrder.numberInMontage.min"));
        }
        if (productionOrderDto.getNumberInMontage() > 100) {
            throw new RuntimeException(getMessage("ProductionOrder.numberInMontage.max"));
        }

        // Validate description (optional)
        if (productionOrderDto.getDescription() != null && productionOrderDto.getDescription().length() > 500) {
            throw new RuntimeException(getMessage("ProductionOrder.description.max.length"));
        }

        // Validate that product exists
        productRepository.findById(productionOrderDto.getProductId())
                .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.product.not.found")));

        // Validate that company exists
        companyRepository.findById(productionOrderDto.getCompanyId())
                .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.company.not.found")));

        // Validate that paper exists
        paperRepository.findById(productionOrderDto.getPaperId())
                .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.paper.not.found")));

        // Validate inks if provided
        if (productionOrderDto.getInkIds() != null && !productionOrderDto.getInkIds().isEmpty()) {
            for (Long inkId : productionOrderDto.getInkIds()) {
                if (!inkRepository.existsById(inkId)) {
                    throw new RuntimeException(getMessage("ProductionOrder.ink.not.found") + inkId);
                }
            }
        }

        // Validate chemicals if provided
        if (productionOrderDto.getChemicalIds() != null && !productionOrderDto.getChemicalIds().isEmpty()) {
            for (Long chemicalId : productionOrderDto.getChemicalIds()) {
                if (!chemicalRepository.existsById(chemicalId)) {
                    throw new RuntimeException(getMessage("ProductionOrder.chemical.not.found") + chemicalId);
                }
            }
        }

        // Validate required sheets calculation
        Double requiredSheets = calculatePapersService(
                productionOrderDto.getNumberInMontage(),
                productionOrderDto.getQuantity()
        );

        if (requiredSheets == null || requiredSheets <= 0) {
            throw new RuntimeException(getMessage("ProductionOrder.requiredSheets.invalid"));
        }

        ProductionOrder productionOrder = productionOrderMapper.toEntity(productionOrderDto);
        productionOrder.setRequiredSheets(requiredSheets);

        if (productionOrderDto.getInkIds() != null && !productionOrderDto.getInkIds().isEmpty()) {
            List<Ink> inks = inkRepository.findAllById(productionOrderDto.getInkIds());
            productionOrder.setInks(inks);
        }

        if (productionOrderDto.getChemicalIds() != null && !productionOrderDto.getChemicalIds().isEmpty()) {
            List<Chemical> chemicals = chemicalRepository.findAllById(productionOrderDto.getChemicalIds());
            productionOrder.setChemicals(chemicals);
        }

        // Set default status if not provided
        if (productionOrder.getStatus() == null) {
            productionOrder.setStatus(ProductionStatus.SENT_PO);
        }

        ProductionOrder savedProductionOrder = productionOrderRepository.save(productionOrder);
        log.info("Production order created successfully with id: {}", savedProductionOrder.getId());
        return productionOrderMapper.toDto(savedProductionOrder);
    }

    private Double calculatePapersService(Double number, @Positive(message = "Quantity must be positive") Double quantity) {
        if (number == null || number <= 0) {
            throw new RuntimeException(getMessage("ProductionOrder.numberInMontage.invalid"));
        }
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(getMessage("ProductionOrder.quantity.invalid"));
        }
        return quantity / (number / 2);
    }

    Boolean stockAdjusted = false;

    @Override
    public ProductionOrderDto update(Long id, ProductionOrderDto productionOrderDto) {
        log.info("Updating production order with id: {}", id);

        ProductionOrder existing = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.not.found.with.id") + id));

        // Validate product
        if (productionOrderDto.getProductId() != null) {
            productRepository.findById(productionOrderDto.getProductId())
                    .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.product.not.found")));
            existing.setProduct(productRepository.findById(productionOrderDto.getProductId()).get());
        }

        // Validate company
        if (productionOrderDto.getCompanyId() != null) {
            companyRepository.findById(productionOrderDto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.company.not.found")));
            existing.setCompany(companyRepository.findById(productionOrderDto.getCompanyId()).get());
        }

        // Validate paper
        if (productionOrderDto.getPaperId() != null) {
            paperRepository.findById(productionOrderDto.getPaperId())
                    .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.paper.not.found")));
            existing.setPaper(paperRepository.findById(productionOrderDto.getPaperId()).get());
        }

        // Validate quantity
        if (productionOrderDto.getQuantity() != null) {
            if (productionOrderDto.getQuantity() < 1) {
                throw new RuntimeException(getMessage("ProductionOrder.quantity.min"));
            }
            if (productionOrderDto.getQuantity() > 1000000) {
                throw new RuntimeException(getMessage("ProductionOrder.quantity.max"));
            }
            existing.setQuantity(productionOrderDto.getQuantity());
        }

        // Validate required sheets
        if (productionOrderDto.getRequiredSheets() != null) {
            if (productionOrderDto.getRequiredSheets() <= 0) {
                throw new RuntimeException(getMessage("ProductionOrder.requiredSheets.invalid"));
            }
            existing.setRequiredSheets(productionOrderDto.getRequiredSheets());
        }

        // Validate required chemicals
        if (productionOrderDto.getRequiredChemicals() != null) {
            if (productionOrderDto.getRequiredChemicals() < 0) {
                throw new RuntimeException(getMessage("ProductionOrder.requiredChemicals.invalid"));
            }
            existing.setRequiredChemicals(productionOrderDto.getRequiredChemicals());
        }

        // Validate required inks
        if (productionOrderDto.getRequiredInks() != null) {
            if (productionOrderDto.getRequiredInks() < 0) {
                throw new RuntimeException(getMessage("ProductionOrder.requiredInks.invalid"));
            }
            existing.setRequiredInks(productionOrderDto.getRequiredInks());
        }

        // Validate status
        if (productionOrderDto.getStatus() != null) {
            existing.setStatus(productionOrderDto.getStatus());
        }

        // Validate description
        if (productionOrderDto.getDescription() != null) {
            if (productionOrderDto.getDescription().length() > 500) {
                throw new RuntimeException(getMessage("ProductionOrder.description.max.length"));
            }
            existing.setDescription(productionOrderDto.getDescription());
        }

        // Update inks
        if (productionOrderDto.getInkIds() != null) {
            if (productionOrderDto.getInkIds().isEmpty()) {
                existing.setInks(new ArrayList<>());
            } else {
                List<Ink> inks = inkRepository.findAllById(productionOrderDto.getInkIds());
                existing.setInks(inks);
            }
        }

        // Update chemicals
        if (productionOrderDto.getChemicalIds() != null) {
            if (productionOrderDto.getChemicalIds().isEmpty()) {
                existing.setChemicals(new ArrayList<>());
            } else {
                List<Chemical> chemicals = chemicalRepository.findAllById(productionOrderDto.getChemicalIds());
                existing.setChemicals(chemicals);
            }
        }

        // Stock adjustment when status changes to ZINC_ARRIVED
        if (existing.getStatus() == ProductionStatus.ZINC_ARRIVED && !stockAdjusted) {
            try {
                // Validate required sheets before stock adjustment
                if (existing.getRequiredSheets() == null || existing.getRequiredSheets() <= 0) {
                    throw new RuntimeException(getMessage("ProductionOrder.requiredSheets.invalid.for.stock"));
                }

                paperService.adjustStock(
                        existing.getPaper().getId(),
                        "deduct",
                        existing.getRequiredSheets()
                );

                if (existing.getChemicals() != null && !existing.getChemicals().isEmpty()) {
                    if (existing.getRequiredChemicals() == null || existing.getRequiredChemicals() <= 0) {
                        throw new RuntimeException(getMessage("ProductionOrder.requiredChemicals.invalid.for.stock"));
                    }
                    existing.getChemicals().forEach(chemical ->
                            chemicalService.adjustStock(
                                    chemical.getId(),
                                    "deduct",
                                    existing.getRequiredChemicals()
                            )
                    );
                }

                if (existing.getInks() != null && !existing.getInks().isEmpty()) {
                    if (existing.getRequiredInks() == null || existing.getRequiredInks() <= 0) {
                        throw new RuntimeException(getMessage("ProductionOrder.requiredInks.invalid.for.stock"));
                    }
                    existing.getInks().forEach(ink ->
                            inkService.adjustStock(
                                    ink.getId(),
                                    "deduct",
                                    existing.getRequiredInks()
                            )
                    );
                }

                stockAdjusted = true;
                log.info("Stock adjusted successfully for production order: {}", id);

            } catch (Exception e) {
                log.error("Error adjusting stock for production order: {}", id, e);
                throw new RuntimeException(getMessage("ProductionOrder.stock.adjustment.failed") + e.getMessage());
            }
        }

        ProductionOrder updatedProductionOrder = productionOrderRepository.save(existing);
        log.info("Production order updated successfully with id: {}", updatedProductionOrder.getId());
        return productionOrderMapper.toDto(updatedProductionOrder);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting production order with id: {}", id);

        ProductionOrder existing = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.not.found.with.id") + id));

        // Check if can delete based on status
        if (existing.getStatus() == ProductionStatus.PRINTING ||
                existing.getStatus() == ProductionStatus.ZINC_ARRIVED) {
            throw new RuntimeException(getMessage("ProductionOrder.cannot.delete.completed"));
        }

        productionOrderRepository.deleteById(id);
        log.info("Production order deleted successfully with id: {}", id);
    }

    @Override
    public ProductionOrderDto findById(Long id) {
        log.info("Fetching production order with id: {}", id);
        ProductionOrder productionOrder = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(getMessage("ProductionOrder.not.found.with.id") + id));
        log.info("Production order found with id: {}", productionOrder.getId());
        return productionOrderMapper.toDto(productionOrder);
    }

    @Override
    public List<ProductionOrderDto> findAll() {
        log.info("Fetching all production orders");
        List<ProductionOrderDto> productionOrders = productionOrderRepository.findAll().stream()
                .map(productionOrderMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} production orders", productionOrders.size());
        return productionOrders;
    }

    @Override
    public Page<ProductionOrderDto> findAll(Pageable pageable) {
        log.info("Fetching paginated production orders with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<ProductionOrderDto> productionOrders = productionOrderRepository.findAll(pageable)
                .map(productionOrderMapper::toDto);
        log.info("Found {} production orders (total pages: {}, total elements: {})",
                productionOrders.getContent().size(),
                productionOrders.getTotalPages(),
                productionOrders.getTotalElements());
        return productionOrders;
    }

    public CalculatePapersService getCalculatePapersService() {
        return calculatePapersService;
    }
}