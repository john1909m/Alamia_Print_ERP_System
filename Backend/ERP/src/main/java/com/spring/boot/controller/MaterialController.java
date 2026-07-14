package com.spring.boot.controller;

import com.spring.boot.dto.MaterialDto;
import com.spring.boot.service.interfaces.MaterialService;
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
 * REST Controller for Material entity.
 * Provides CRUD operations for Material management.
 */
@RestController
@RequestMapping("/api/materials")
@Tag(name = "Materials", description = "Material management endpoints")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @Operation(summary = "Get all materials", description = "Retrieve a paginated list of all materials")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Materials retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)))
    })
    @GetMapping
    public ResponseEntity<Page<MaterialDto>> getAllMaterials(
            @Parameter(description = "Pagination information", hidden = true) Pageable pageable) {
        Page<MaterialDto> materials = materialService.findAll(pageable);
        return ResponseEntity.ok(materials);
    }

    @Operation(summary = "Get material by ID", description = "Retrieve a specific material by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Material retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MaterialDto.class))),
            @ApiResponse(responseCode = "404", description = "Material not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MaterialDto.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<MaterialDto> getMaterialById(@PathVariable Long id) {
        MaterialDto material = materialService.findById(id);
        return ResponseEntity.ok(material);
    }

    @Operation(summary = "Create material", description = "Create a new material")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Material created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MaterialDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MaterialDto.class)))
    })
    @PostMapping
    public ResponseEntity<MaterialDto> createMaterial(@Valid @RequestBody MaterialDto materialDto) {
        MaterialDto savedMaterial = materialService.create(materialDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedMaterial.getId())
                .toUri();
        return ResponseEntity.created(location)
                .body(savedMaterial);
    }

    @Operation(summary = "Update material", description = "Update an existing material")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Material updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MaterialDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MaterialDto.class))),
            @ApiResponse(responseCode = "404", description = "Material not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MaterialDto.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<MaterialDto> updateMaterial(@PathVariable Long id, @Valid @RequestBody MaterialDto materialDto) {
        MaterialDto updatedMaterial = materialService.update(id, materialDto);
        return ResponseEntity.ok(updatedMaterial);
    }

    @Operation(summary = "Delete material", description = "Delete a material by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Material deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Material not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = MaterialDto.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // TODO: Add custom business logic for material-specific operations if needed
    // Example: getMaterialsByType, getMaterialsBySupplier, etc.
}