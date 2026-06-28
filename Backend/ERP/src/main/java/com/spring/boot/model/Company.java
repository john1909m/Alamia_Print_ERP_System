package com.spring.boot.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Company extends BaseEntity{
    private Long id;

    private String name;

    private String address;

    private String phone;

    private String email;

    private String notes;

    private String managerName;

    @OneToMany(mappedBy = "company",cascade = CascadeType.ALL)
    private List<Product> products;

    @OneToMany(mappedBy = "company",cascade = CascadeType.ALL)
    private List<ProductionOrder> orders;

}
