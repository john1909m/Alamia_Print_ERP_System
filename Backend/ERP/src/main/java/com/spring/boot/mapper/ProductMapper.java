package com.spring.boot.mapper;

import com.spring.boot.model.Product;
import com.spring.boot.dto.ProductDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = {ProductionOrderMapper.class})
public interface ProductMapper extends BaseMapper {

    @Mapping(source = "company.id",target = "companyId")
    ProductDto toDto(Product entity);

    @Mapping(source = "companyId",target = "company.id")
    Product toEntity(ProductDto dto);
}