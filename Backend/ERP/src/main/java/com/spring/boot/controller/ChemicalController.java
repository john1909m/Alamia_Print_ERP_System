package com.spring.boot.controller;

import com.spring.boot.common.ApiResponse;
import com.spring.boot.dto.ChemicalDto;
import com.spring.boot.service.interfaces.ChemicalService;
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
 * REST Controller for Chemical entity.
 * Provides CRUD operations for Chemical management.
 */
@RestController
@RequestMapping("/api/chemicals")
@Tag(name = "Chemicals", description = "Chemical management endpoints")
@RequiredArgsConstructor
public class ChemicalController {

    private final ChemicalService chemicalService;

    @Operation(summary = "Get all chemicals", description = "Retrieve a paginated list of all chemicals")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Chemicals retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ChemicalDto>>> getAllChemicals(
            @Parameter(description = "Pagination information", hidden = true) Pageable pageable) {
        Page<ChemicalDto> chemicals = chemicalService.findAll(pageable);
        return ResponseEntity.ok(
                ApiResponse.success("Chemicals retrieved successfully", chemicals)
        );
    }

    @Operation(summary = "Get chemical by ID", description = "Retrieve a specific chemical by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Chemical retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "404", description = "Chemical not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChemicalDto>> getChemicalById(@PathVariable Long id) {
        ChemicalDto chemical = chemicalService.findById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Chemical retrieved successfully", chemical)
        );
    }

    @Operation(summary = "Create chemical", description = "Create a new chemical")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Chemical created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<ChemicalDto>> createChemical(@Valid @RequestBody ChemicalDto chemicalDto) {
        ChemicalDto savedChemical = chemicalService.create(chemicalDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedChemical.getId())
                .toUri();
        return ResponseEntity.created(location)
                .body(ApiResponse.success("Chemical created successfully", savedChemical));
    }

    @Operation(summary = "Update chemical", description = "Update an existing chemical")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Chemical updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "404", description = "Chemical not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChemicalDto>> updateChemical(@PathVariable Long id, @Valid @RequestBody ChemicalDto chemicalDto) {
        ChemicalDto updatedChemical = chemicalService.update(id, chemicalDto);
        return ResponseEntity.ok(
                ApiResponse.success("Chemical updated successfully", updatedChemical)
        );
    }

    @Operation(summary = "Delete chemical", description = "Delete a chemical by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Chemical deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Chemical not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChemical(@PathVariable Long id) {
        chemicalService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // TODO: Add custom business logic for chemical-specific operations if needed
    // Example: getChemicalsByType, getChemicalsBySupplier, etc.
}