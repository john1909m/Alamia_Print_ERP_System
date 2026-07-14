package com.spring.boot.controller;

import com.spring.boot.dto.ProductionOrderDto;
import com.spring.boot.service.interfaces.ProductionOrderService;
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
 * REST Controller for ProductionOrder entity.
 * Provides CRUD operations for Production Order management.
 */
@RestController
@RequestMapping("/api/production-orders")
@Tag(name = "Production Orders", description = "Production order management endpoints")
@RequiredArgsConstructor
public class ProductionOrderController {

    private final ProductionOrderService productionOrderService;

    @Operation(summary = "Get all production orders", description = "Retrieve a paginated list of all production orders")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Production orders retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)))
    })
    @GetMapping
    public ResponseEntity<Page<ProductionOrderDto>> getAllProductionOrders(
            @Parameter(description = "Pagination information", hidden = true) Pageable pageable) {
        Page<ProductionOrderDto> orders = productionOrderService.findAll(pageable);
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get production order by ID", description = "Retrieve a specific production order by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Production order retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductionOrderDto.class))),
            @ApiResponse(responseCode = "404", description = "Production order not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductionOrderDto.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductionOrderDto> getProductionOrderById(@PathVariable Long id) {
        ProductionOrderDto order = productionOrderService.findById(id);
        return ResponseEntity.ok(order);
    }

    @Operation(summary = "Create production order", description = "Create a new production order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Production order created successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductionOrderDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductionOrderDto.class)))
    })
    @PostMapping
    public ResponseEntity<ProductionOrderDto> createProductionOrder(@Valid @RequestBody ProductionOrderDto productionOrderDto) {
        ProductionOrderDto savedOrder = productionOrderService.create(productionOrderDto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedOrder.getId())
                .toUri();
        return ResponseEntity.created(location)
                .body(savedOrder);
    }

    @Operation(summary = "Update production order", description = "Update an existing production order")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Production order updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductionOrderDto.class))),
            @ApiResponse(responseCode = "400", description = "Validation error",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductionOrderDto.class))),
            @ApiResponse(responseCode = "404", description = "Production order not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductionOrderDto.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ProductionOrderDto> updateProductionOrder(@PathVariable Long id, @Valid @RequestBody ProductionOrderDto productionOrderDto) {
        ProductionOrderDto updatedOrder = productionOrderService.update(id, productionOrderDto);
        return ResponseEntity.ok(updatedOrder);
    }

    @Operation(summary = "Delete production order", description = "Delete a production order by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Production order deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Production order not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductionOrderDto.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductionOrder(@PathVariable Long id) {
        productionOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // TODO: Add custom business logic for production order-specific operations if needed
    // Example: getOrdersByStatus, getOrdersByDateRange, getOrdersByProduct, etc.
}