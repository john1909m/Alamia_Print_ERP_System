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

    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotNull(message = "Company is required")
    private CompanyDto company;

    @NotNull(message = "Product list is required")
    private List<ProductDto> product;

    @Positive(message = "Quantity must be positive")
    private Double quantity;

    @NotNull(message = "Paper is required")
    private PaperDto paper;

    @Size(max = 500, message = "Material list must not exceed 500 items")
    private List<MaterialDto> material;

    @Positive(message = "Required sheets must be positive")
    private Double requiredSheets;

    @NotNull(message = "Status is required")
    private ProductionStatus status;
}