package com.spring.boot.model;

import com.spring.boot.enums.PaperType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

    @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL)
    private List<ProductionOrder> orders;

    private Double width;

    private Double height;

    private Double weight;

    private Double stock;

    @Enumerated(EnumType.STRING)
    private PaperType paperType;

    private String notes;


}
