package com.spring.boot.mapper;

import com.spring.boot.model.ProductionOrder;
import com.spring.boot.dto.ProductionOrderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for converting between ProductionOrder entity and ProductionOrderDto.
 */
@Mapper(
        componentModel = "spring",
        uses = {
                CompanyMapper.class,
                ProductMapper.class,
                PaperMapper.class,
                InkMapper.class,
                ChemicalMapper.class
        }
)
public interface ProductionOrderMapper extends BaseMapper {

    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "paper.id", target = "paperId")
    @Mapping(target = "inkIds", ignore = true)
    @Mapping(target = "chemicalIds", ignore = true)
    ProductionOrderDto toDto(ProductionOrder entity);


    @Mapping(source = "companyId", target = "company.id")
    @Mapping(source = "productId", target = "product.id")
    @Mapping(source = "paperId", target = "paper.id")
    @Mapping(target = "inks", ignore = true)
    @Mapping(target = "chemicals", ignore = true)
    ProductionOrder toEntity(ProductionOrderDto dto);
}