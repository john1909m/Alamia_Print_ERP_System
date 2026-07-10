package com.spring.boot.controller;

import com.spring.boot.common.ApiResponse;
import com.spring.boot.dto.MaterialDto;
import com.spring.boot.service.interfaces.MaterialService;
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
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @GetMapping
    public ResponseEntity<ApiResponse<Page<MaterialDto>>> getAllMaterials(
            @Parameter(description = "Pagination information", hidden = true) Pageable pageable) {
        Page<MaterialDto> materials = materialService.findAll(pageable);
        return ResponseEntity.ok(
                ApiResponse.success("Materials retrieved successfully", materials)
        );
    }

    @Operation(summary = "Get material by ID", description = "Retrieve a specific material by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Material retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "404", description = "Material not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaterialDto>> getMaterialById(@PathVariable Long id) {
        MaterialDto material = materialService.findById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Material retrieved successfully", material)
        );
    }

    @Operation(summary = "Create material", description = "Create a new material")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Material created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<MaterialDto>> createMaterial(@Valid @RequestBody MaterialDto materialDto) {
        MaterialDto savedMaterial = materialService.create(materialDto);
        if (materialDto.getId() == null) {
            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(savedMaterial.getId())
                    .toUri();
            return ResponseEntity.created(location)
                    .body(ApiResponse.success("Material created successfully", savedMaterial));
        }
        return ResponseEntity.ok(
                ApiResponse.success("Material updated successfully", savedMaterial)
        );
    }

    @Operation(summary = "Update material", description = "Update an existing material")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Material updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class))),
            @ApiResponse(responseCode = "404", description = "Material not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MaterialDto>> updateMaterial(@PathVariable Long id, @Valid @RequestBody MaterialDto materialDto) {
        MaterialDto updatedMaterial = materialService.update(id, materialDto);
        return ResponseEntity.ok(
                ApiResponse.success("Material updated successfully", updatedMaterial)
        );
    }

    @Operation(summary = "Delete material", description = "Delete a material by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Material deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Material not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(@PathVariable Long id) {
        materialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}