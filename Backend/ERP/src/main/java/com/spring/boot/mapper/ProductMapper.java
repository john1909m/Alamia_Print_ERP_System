package com.spring.boot.mapper;

import com.spring.boot.model.Product;
import com.spring.boot.dto.ProductDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for converting between Product entity and ProductDto.
 */
@Mapper(componentModel = "spring", uses = {ProductionOrderMapper.class})
public interface ProductMapper extends BaseMapper {

    @Mapping(source = "company.id",target = "company_id")
    ProductDto toDto(Product entity);
    Product toEntity(ProductDto dto);
}