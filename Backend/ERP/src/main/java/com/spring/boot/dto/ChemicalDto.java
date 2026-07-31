package com.spring.boot.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object for Chemical entity.
 */
@Getter
@Setter
@RequiredArgsConstructor
public class ChemicalDto {
    private Long id;

    @Positive(message = "Material ID must be positive")
    private Long materialId;


    @Size(max = 500, message = "Chemical types must not exceed 500 characters")
    private String chemicalType;

    private Double stock;
}