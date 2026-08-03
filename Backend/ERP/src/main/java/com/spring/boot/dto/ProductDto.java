package com.spring.boot.dto;

import com.spring.boot.enums.ProductType;
import com.spring.boot.dto.ProductionOrderDto;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object for Product entity.
 */
@Getter
@Setter
@RequiredArgsConstructor
public class ProductDto {
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String name;

    @Size(max = 50, message = "Product code must not exceed 50 characters")
    private String code;

    private ProductType type;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;

    private List<ProductionOrderDto> orders;

    @NotNull(message = "Company is required")
    private Long companyId;

    private Double width;

    private Double height;

}