package com.spring.boot.mapper;

import com.spring.boot.model.ProductionOrder;
import com.spring.boot.dto.ProductionOrderDto;
import com.spring.boot.model.Ink;
import com.spring.boot.model.Chemical;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

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
    @Mapping(source = "inks", target = "inkIds", qualifiedByName = "mapInksToIds")
    @Mapping(source = "chemicals", target = "chemicalIds", qualifiedByName = "mapChemicalsToIds")
    ProductionOrderDto toDto(ProductionOrder entity);

    @Mapping(source = "companyId", target = "company.id")
    @Mapping(source = "productId", target = "product.id")
    @Mapping(source = "paperId", target = "paper.id")
    @Mapping(source = "inkIds", target = "inks", qualifiedByName = "mapIdsToInks")
    @Mapping(source = "chemicalIds", target = "chemicals", qualifiedByName = "mapIdsToChemicals")
    ProductionOrder toEntity(ProductionOrderDto dto);

    // ✅ دوال مساعدة للتحويل
    @Named("mapInksToIds")
    default List<Long> mapInksToIds(List<Ink> inks) {
        if (inks == null) return null;
        return inks.stream()
                .map(Ink::getId)
                .collect(Collectors.toList());
    }

    @Named("mapChemicalsToIds")
    default List<Long> mapChemicalsToIds(List<Chemical> chemicals) {
        if (chemicals == null) return null;
        return chemicals.stream()
                .map(Chemical::getId)
                .collect(Collectors.toList());
    }

    @Named("mapIdsToInks")
    default List<Ink> mapIdsToInks(List<Long> inkIds) {
        // هتتعامل معاها في الـ Service عشان تجيب الـ Ink من الـ Repository
        return null;
    }

    @Named("mapIdsToChemicals")
    default List<Chemical> mapIdsToChemicals(List<Long> chemicalIds) {
        // هتتعامل معاها في الـ Service عشان تجيب الـ Chemical من الـ Repository
        return null;
    }
}