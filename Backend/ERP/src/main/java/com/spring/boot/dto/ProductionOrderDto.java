package com.spring.boot.dto;

import com.spring.boot.model.Company;
import com.spring.boot.model.Paper;
import com.spring.boot.model.Product;
import com.spring.boot.enums.ProductionStatus;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object for ProductionOrder entity.
 */
@Getter
@Setter
@RequiredArgsConstructor
public class ProductionOrderDto {
    private Long id;

    @NotNull(message = "Company is required")
    private Long companyId;

    @NotNull(message = "Product list is required")
    private Long productId;

    @Positive(message = "Quantity must be positive")
    private Double quantity;

    @NotNull(message = "Paper is required")
    private Long paperId;

    @Size(max = 500, message = "ink list must not exceed 500 items")
    private List<Long> inkIds;

    @Size(max = 500, message = "chemical list must not exceed 500 items")
    private List<Long> chemicalIds;


//    @Positive(message = "Required sheets must be positive")
    private Double requiredSheets;

    private Double numberInMontage;

    @Positive(message = "Required sheets must be positive")
    private Double requiredChemicals;

    @Positive(message = "Required sheets must be positive")
    private Double requiredInks;

    @NotNull(message = "Status is required")
    private ProductionStatus status;

    private String description;

}