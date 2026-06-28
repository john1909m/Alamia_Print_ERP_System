package com.spring.boot.model;

import com.spring.boot.enums.MaterialType;
import com.spring.boot.enums.MaterialUnit;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private MaterialType type;

    private MaterialUnit unit;

    private Double stock;

    private String notes;

    @OneToMany(mappedBy = "material",cascade = CascadeType.ALL)
    private List<Paper> paper;

    @OneToMany(mappedBy = "material",cascade = CascadeType.ALL)
    private List<Ink> inks;

    @OneToMany(mappedBy = "material",cascade = CascadeType.ALL)
    private List<Chemical> chemicals;

    @ManyToMany
    @JoinTable(
            name = "material_production_order",
            joinColumns = @JoinColumn(name = "material_id"),
            inverseJoinColumns = @JoinColumn(name = "production_order_id")
    )
    private List<ProductionOrder> productionOrders;

}
