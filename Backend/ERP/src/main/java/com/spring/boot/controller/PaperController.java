package com.spring.boot.controller;

import com.spring.boot.dto.PaperDto;
import com.spring.boot.service.interfaces.PaperService;
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
 * REST Controller for Paper entity.
 * Provides CRUD operations for Paper management.
 */
@RestController
@RequestMapping("/api/papers")
@Tag(name = "Papers", description = "Paper management endpoints")
@RequiredArgsConstructor
public class PaperController {

    private final PaperService paperService;

    @Operation(summary = "Get all papers", description = "Retrieve a paginated list of all papers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Papers retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)))
    })
    @GetMapping
    public ResponseEntity<Page<PaperDto>> getAllPapers(
            @Parameter(description = "Pagination information", hidden = true) Pageable pageable) {
        Page<PaperDto> papers = paperService.findAll(pageable);
        return ResponseEntity.ok(papers);
    }

    @Operation(summary = "Get paper by ID", description = "Retrieve a specific paper by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paper retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaperDto.class))),
            @ApiResponse(responseCode = "404", description = "Paper not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaperDto.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<PaperDto> getPaperById(@PathVariable Long id) {
        PaperDto paper = paperService.findById(id);
        return ResponseEntity.ok(paper);
    }

    @Operation(summary = "Create paper", description = "Create a new paper")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Paper created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaperDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaperDto.class)))
    })
    @PostMapping
    public ResponseEntity<PaperDto> createPaper(@Valid @RequestBody PaperDto paperDto) {
        PaperDto savedPaper = paperService.create(paperDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedPaper.getId())
                .toUri();
        return ResponseEntity.created(location)
                .body(savedPaper);
    }

    @Operation(summary = "Update paper", description = "Update an existing paper")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paper updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaperDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaperDto.class))),
            @ApiResponse(responseCode = "404", description = "Paper not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaperDto.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<PaperDto> updatePaper(@PathVariable Long id, @Valid @RequestBody PaperDto paperDto) {
        PaperDto updatedPaper = paperService.update(id, paperDto);
        return ResponseEntity.ok(updatedPaper);
    }

    @Operation(summary = "Delete paper", description = "Delete a paper by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Paper deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Paper not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaperDto.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaper(@PathVariable Long id) {
        paperService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // TODO: Add custom business logic for paper-specific operations if needed
    // Example: getPapersByType, getPapersBySupplier, etc.
}