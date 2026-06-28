package com.spring.boot.model;

import com.spring.boot.enums.ProductType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String code;

    private ProductType type;

    private String notes;


    @ManyToMany
    @JoinTable(
            name = "product_production_order",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "production_order_id")
    )
    private List<ProductionOrder> orders;



}
