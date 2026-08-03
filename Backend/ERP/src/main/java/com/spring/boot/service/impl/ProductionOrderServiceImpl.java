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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for ProductionOrder entity.
 */
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


    @Override
    public ProductionOrderDto create(ProductionOrderDto productionOrderDto) {
        log.info("Creating new production order with description: {}", productionOrderDto.getDescription());
        ProductionOrder productionOrder = productionOrderMapper.toEntity(productionOrderDto);

        if (productionOrderDto.getInkIds() != null && !productionOrderDto.getInkIds().isEmpty()) {
            List<Ink> inks = inkRepository.findAllById(productionOrderDto.getInkIds());
            productionOrder.setInks(inks);
        }

        if (productionOrderDto.getChemicalIds() != null && !productionOrderDto.getChemicalIds().isEmpty()) {
            List<Chemical> chemicals = chemicalRepository.findAllById(productionOrderDto.getChemicalIds());
            productionOrder.setChemicals(chemicals);
        }

        productionOrder.setRequiredSheets(calculatePapersService(productionOrderDto.getNumberInMontage(),productionOrderDto.getQuantity()));
        ProductionOrder savedProductionOrder = productionOrderRepository.save(productionOrder);
        log.info("Production order created successfully with id: {}", savedProductionOrder.getId());
        return productionOrderMapper.toDto(savedProductionOrder);
    }

    private Double calculatePapersService(Double number, @Positive(message = "Quantity must be positive") Double quantity) {
        Double requiredPapers=quantity/(number/2);

        return requiredPapers;
    }

    Boolean stockAdjusted=false;
    @Override
    public ProductionOrderDto update(Long id, ProductionOrderDto productionOrderDto) {
        log.info("Updating production order with id: {}", id);
        ProductionOrder existing = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production order not found with id: " + id));

        existing.setProduct(productRepository.findById(productionOrderDto.getProductId())
                .orElseThrow(()-> new RuntimeException("Product not found with id:")));
        existing.setCompany(companyRepository.findById(productionOrderDto.getCompanyId())
                .orElseThrow(()-> new RuntimeException("company not found with id:")));

        existing.setPaper(paperRepository.findById(productionOrderDto.getPaperId())
                .orElseThrow(()-> new RuntimeException("paper not found with id:")));

        existing.setQuantity(productionOrderDto.getQuantity());
        existing.setRequiredSheets(productionOrderDto.getRequiredSheets());
        existing.setRequiredChemicals(productionOrderDto.getRequiredChemicals());
        existing.setRequiredInks(productionOrderDto.getRequiredInks());
        existing.setStatus(productionOrderDto.getStatus());
        existing.setDescription(productionOrderDto.getDescription());

//        ProductionOrder productionOrderToUpdate = productionOrderMapper.toEntity(productionOrderDto);
//        productionOrderToUpdate.setId(existing.getId());
//        ProductionOrder updatedProductionOrder = productionOrderRepository.save(productionOrderToUpdate);

        if (productionOrderDto.getInkIds() != null) {
            if (productionOrderDto.getInkIds().isEmpty()) {
                existing.setInks(new ArrayList<>());
            } else {
                List<Ink> inks = inkRepository.findAllById(productionOrderDto.getInkIds());
                existing.setInks(inks);
            }
        }

        if (productionOrderDto.getChemicalIds() != null) {
            if (productionOrderDto.getChemicalIds().isEmpty()) {
                existing.setChemicals(new ArrayList<>());
            } else {
                List<Chemical> chemicals = chemicalRepository.findAllById(productionOrderDto.getChemicalIds());
                existing.setChemicals(chemicals);
            }
        }


        if (existing.getStatus() == ProductionStatus.ZINC_ARRIVED && !stockAdjusted) {
            try {
                paperService.adjustStock(
                        productionOrderDto.getPaperId(),
                        "deduct",
                        productionOrderDto.getRequiredSheets()
                );

                if (productionOrderDto.getChemicalIds() != null && !productionOrderDto.getChemicalIds().isEmpty()) {
                    productionOrderDto.getChemicalIds().forEach(chemicalId ->
                            chemicalService.adjustStock(
                                    chemicalId,
                                    "deduct",
                                    productionOrderDto.getRequiredChemicals()
                            )
                    );
                }

                if (productionOrderDto.getInkIds() != null && !productionOrderDto.getInkIds().isEmpty()) {
                    productionOrderDto.getInkIds().forEach(inkId ->
                            inkService.adjustStock(
                                    inkId,
                                    "deduct",
                                    productionOrderDto.getRequiredInks()
                            )
                    );
                }

                stockAdjusted = true;
                log.info("Stock adjusted successfully for production order: {}", id);

            } catch (Exception e) {
                log.error("Error adjusting stock for production order: {}", id, e);
                // لو عايز ترمي Exception عشان الـ transaction يرجع
                // throw new RuntimeException("Failed to adjust stock", e);
            }
        }


        ProductionOrder updatedProductionOrder = productionOrderRepository.save(existing);
        log.info("Production order updated successfully with id: {}", updatedProductionOrder.getId());
        return productionOrderMapper.toDto(updatedProductionOrder);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting production order with id: {}", id);
        productionOrderRepository.deleteById(id);
        log.info("Production order deleted successfully with id: {}", id);
    }

    @Override
    public ProductionOrderDto findById(Long id) {
        log.info("Fetching production order with id: {}", id);
        ProductionOrder productionOrder = productionOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Production order not found with id: " + id));
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