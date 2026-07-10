package com.spring.boot.dto;

import com.spring.boot.dto.ProductDto;
import com.spring.boot.dto.ProductionOrderDto;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

/**
 * Data Transfer Object for Company entity.
 */
@Getter
@Setter
@RequiredArgsConstructor
public class CompanyDto {
    private Long id;

    @NotBlank(message = "Company name is required")
    @Size(max = 100, message = "Company name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(max = 200, message = "Address must not exceed 200 characters")
    private String address;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phone;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;

    @NotBlank(message = "Manager name is required")
    @Size(max = 100, message = "Manager name must not exceed 100 characters")
    private String managerName;

    private List<ProductDto> products;

    private List<ProductionOrderDto> orders;
}