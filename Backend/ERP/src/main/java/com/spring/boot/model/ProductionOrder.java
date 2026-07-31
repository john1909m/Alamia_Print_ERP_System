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


    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    private Product product;

    private Double quantity;

    @ManyToOne
    @JoinColumn(name = "paper_id")
    Paper paper;

    @ManyToMany
    @JoinTable(
            name = "production_order_inks",
            joinColumns = @JoinColumn(name = "production_order_id"),
            inverseJoinColumns = @JoinColumn(name = "ink_id")
    )
    private List<Ink> inks;

    @ManyToMany
    @JoinTable(
            name = "production_order_chemicals",
            joinColumns = @JoinColumn(name = "production_order_id"),
            inverseJoinColumns = @JoinColumn(name = "chemical_id")
    )
    private List<Chemical> chemicals;

    private Double requiredSheets;

    private Double requiredInks;

    private Double requiredChemicals;

    @Enumerated(EnumType.STRING)
    private ProductionStatus status;

    private String description;


}
