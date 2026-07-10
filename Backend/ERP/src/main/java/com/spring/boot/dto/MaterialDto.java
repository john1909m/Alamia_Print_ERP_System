package com.spring.boot.dto;

import com.spring.boot.enums.MaterialType;
import com.spring.boot.enums.MaterialUnit;
import com.spring.boot.dto.ChemicalDto;
import com.spring.boot.dto.InkDto;
import com.spring.boot.dto.PaperDto;
import com.spring.boot.dto.ProductionOrderDto;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object for Material entity.
 */
@Getter
@Setter
@RequiredArgsConstructor
public class MaterialDto {
    private Long id;

    @NotBlank(message = "Material name is required")
    @Size(max = 100, message = "Material name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Material type is required")
    private MaterialType type;

    @NotNull(message = "Unit is required")
    private MaterialUnit unit;

    @Min(value = 0, message = "Stock must be zero or greater")
    private Double stock;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;

    private List<PaperDto> papers;

    private List<InkDto> inks;

    private List<ChemicalDto> chemicals;

    private List<ProductionOrderDto> productionOrders;
}