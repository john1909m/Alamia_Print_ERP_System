package com.spring.boot.mapper;

import com.spring.boot.model.ProductionOrder;
import com.spring.boot.dto.ProductionOrderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for converting between ProductionOrder entity and ProductionOrderDto.
 */
@Mapper(componentModel = "spring", uses = {CompanyMapper.class, ProductMapper.class, PaperMapper.class, MaterialMapper.class})
public interface ProductionOrderMapper extends BaseMapper {

    @Mapping(source = "material",target = "material")
    ProductionOrderDto toDto(ProductionOrder entity);
    ProductionOrder toEntity(ProductionOrderDto dto);
}