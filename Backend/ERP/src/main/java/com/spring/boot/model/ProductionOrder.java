package com.spring.boot.model;

import com.spring.boot.enums.ProductionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class ProductionOrder extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID orderId;

    @ManyToOne
    @JoinColumn(name = "company_id")
    Company company;

    @ManyToMany(mappedBy = "production_order")
    private List<Product> product;

    private Double quantity;

    @ManyToOne
    @JoinColumn(name = "paper_id")
    Paper paper;

    @ManyToMany(mappedBy = "production_order")
    private List<Material> material;

    private Double requiredSheets;

    private ProductionStatus status;





}
