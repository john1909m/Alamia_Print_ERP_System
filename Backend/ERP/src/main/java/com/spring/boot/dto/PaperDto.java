package com.spring.boot.dto;

import com.spring.boot.dto.MaterialDto;
import com.spring.boot.dto.ProductionOrderDto;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object for Paper entity.
 */
@Getter
@Setter
@RequiredArgsConstructor
public class PaperDto {
    private Long id;

    private Long material_id;

    private String name;

    private List<ProductionOrderDto> orders;

    @Positive(message = "Width must be positive")
    private Double width;

    @Positive(message = "Height must be positive")
    private Double height;

    @Positive(message = "Weight must be positive")
    private Double weight;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}