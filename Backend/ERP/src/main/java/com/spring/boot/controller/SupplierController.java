package com.spring.boot.controller;

import com.spring.boot.dto.SupplierDto;
import com.spring.boot.service.interfaces.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
 * REST Controller for Supplier entity.
 * Provides CRUD operations for Supplier management.
 */
@RestController
@RequestMapping("/api/suppliers")
@Tag(name = "Suppliers", description = "Supplier management endpoints")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @Operation(summary = "Get all suppliers", description = "Retrieve a paginated list of all suppliers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Suppliers retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)))
    })
    @GetMapping
    public ResponseEntity<Page<SupplierDto>> getAllSuppliers(
            @Parameter(description = "Pagination information", hidden = true) Pageable pageable) {
        Page<SupplierDto> suppliers = supplierService.findAll(pageable);
        return ResponseEntity.ok(suppliers);
    }

    @Operation(summary = "Get supplier by ID", description = "Retrieve a specific supplier by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Supplier retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SupplierDto.class))),
            @ApiResponse(responseCode = "404", description = "Supplier not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SupplierDto.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<SupplierDto> getSupplierById(@PathVariable Long id) {
        SupplierDto supplier = supplierService.findById(id);
        return ResponseEntity.ok(supplier);
    }

    @Operation(summary = "Create supplier", description = "Create a new supplier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Supplier created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SupplierDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SupplierDto.class)))
    })
    @PostMapping
    public ResponseEntity<SupplierDto> createSupplier(@Valid @RequestBody SupplierDto supplierDto) {
        SupplierDto savedSupplier = supplierService.create(supplierDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedSupplier.getId())
                .toUri();
        return ResponseEntity.created(location)
                .body(savedSupplier);
    }

    @Operation(summary = "Update supplier", description = "Update an existing supplier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Supplier updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SupplierDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SupplierDto.class))),
            @ApiResponse(responseCode = "404", description = "Supplier not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SupplierDto.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<SupplierDto> updateSupplier(@PathVariable Long id, @Valid @RequestBody SupplierDto supplierDto) {
        SupplierDto updatedSupplier = supplierService.update(id, supplierDto);
        return ResponseEntity.ok(updatedSupplier);
    }

    @Operation(summary = "Delete supplier", description = "Delete a supplier by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Supplier deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Supplier not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = SupplierDto.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // TODO: Add custom business logic for supplier-specific operations if needed
    // Example: getSuppliersByRegion, getSuppliersByRating, etc.
}