package com.spring.boot.mapper;

import com.spring.boot.model.Product;
import com.spring.boot.dto.ProductDto;
import org.mapstruct.Mapper;

/**
 * Mapper for converting between Product entity and ProductDto.
 */
@Mapper(componentModel = "spring", uses = {ProductionOrderMapper.class})
public interface ProductMapper extends BaseMapper {
    ProductDto toDto(Product entity);
    Product toEntity(ProductDto dto);
}