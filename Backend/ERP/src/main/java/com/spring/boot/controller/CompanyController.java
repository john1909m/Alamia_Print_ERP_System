package com.spring.boot.controller;

import com.spring.boot.common.ApiResponse;
import com.spring.boot.dto.CompanyDto;
import com.spring.boot.service.interfaces.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

/**
 * REST Controller for Company entity.
 * Provides CRUD operations for Company management.
 */
@RestController
@RequestMapping("/api/companies")
@Tag(name = "Companies", description = "Company management endpoints")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @Operation(summary = "Get all companies", description = "Retrieve a paginated list of all companies")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Companies retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CompanyDto>>> getAllCompanies(
            @Parameter(description = "Pagination information", hidden = true) Pageable pageable) {
        Page<CompanyDto> companies = companyService.findAll(pageable);
        return ResponseEntity.ok(
                ApiResponse.success("Companies retrieved successfully", companies)
        );
    }

    @Operation(summary = "Get company by ID", description = "Retrieve a specific company by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "404", description = "Company not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyDto>> getCompanyById(@PathVariable Long id) {
        CompanyDto company = companyService.findById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Company retrieved successfully", company)
        );
    }

    @Operation(summary = "Create company", description = "Create a new company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Company created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<CompanyDto>> createCompany(@Valid @RequestBody CompanyDto companyDto) {
        CompanyDto savedCompany = companyService.create(companyDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedCompany.getId())
                .toUri();
        return ResponseEntity.created(location)
                .body(ApiResponse.success("Company created successfully", savedCompany));
    }

    @Operation(summary = "Update company", description = "Update an existing company")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Company updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "404", description = "Company not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyDto>> updateCompany(@PathVariable Long id, @Valid @RequestBody CompanyDto companyDto) {
        CompanyDto updatedCompany = companyService.update(id, companyDto);
        return ResponseEntity.ok(
                ApiResponse.success("Company updated successfully", updatedCompany)
        );
    }

    @Operation(summary = "Delete company", description = "Delete a company by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Company deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Company not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // TODO: Add custom business logic for company-specific operations if needed
    // Example: getCompaniesByRegion, getCompaniesByIndustry, etc.
}