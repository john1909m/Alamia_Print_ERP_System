package com.spring.boot.controller;

import com.spring.boot.dto.InkDto;
import com.spring.boot.service.interfaces.InkService;
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
 * REST Controller for Ink entity.
 * Provides CRUD operations for Ink management.
 */
@RestController
@RequestMapping("/api/inks")
@Tag(name = "Inks", description = "Ink management endpoints")
@RequiredArgsConstructor
public class InkController {

    private final InkService inkService;

    @Operation(summary = "Get all inks", description = "Retrieve a paginated list of all inks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Inks retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)))
    })
    @GetMapping
    public ResponseEntity<Page<InkDto>> getAllInks(
            @Parameter(description = "Pagination information", hidden = true) Pageable pageable) {
        Page<InkDto> inks = inkService.findAll(pageable);
        return ResponseEntity.ok(inks);
    }

    @Operation(summary = "Get ink by ID", description = "Retrieve a specific ink by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ink retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InkDto.class))),
            @ApiResponse(responseCode = "404", description = "Ink not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InkDto.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<InkDto> getInkById(@PathVariable Long id) {
        InkDto ink = inkService.findById(id);
        return ResponseEntity.ok(ink);
    }

    @Operation(summary = "Create ink", description = "Create a new ink")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Ink created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InkDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InkDto.class)))
    })
    @PostMapping
    public ResponseEntity<InkDto> createInk(@Valid @RequestBody InkDto inkDto) {
        InkDto savedInk = inkService.create(inkDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedInk.getId())
                .toUri();
        return ResponseEntity.created(location)
                .body(savedInk);
    }

    @Operation(summary = "Update ink", description = "Update an existing ink")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ink updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InkDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InkDto.class))),
            @ApiResponse(responseCode = "404", description = "Ink not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InkDto.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<InkDto> updateInk(@PathVariable Long id, @Valid @RequestBody InkDto inkDto) {
        InkDto updatedInk = inkService.update(id, inkDto);
        return ResponseEntity.ok(updatedInk);
    }

    @Operation(summary = "Delete ink", description = "Delete an ink by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Ink deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Ink not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InkDto.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInk(@PathVariable Long id) {
        inkService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // TODO: Add custom business logic for ink-specific operations if needed
    // Example: getInksByColor, getInksByType, etc.
}