package com.spring.boot.dto;

import com.spring.boot.dto.MaterialDto;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object for Ink entity.
 */
@Getter
@Setter
@RequiredArgsConstructor
public class InkDto {
    private Long id;

    private Long materialId;


    @Size(max = 500, message = "Ink types must not exceed 500 characters")
    private String inkType;

    private Double stock;
}