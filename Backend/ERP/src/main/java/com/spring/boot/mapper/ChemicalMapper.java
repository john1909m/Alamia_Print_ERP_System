package com.spring.boot.mapper;

import com.spring.boot.model.Chemical;
import com.spring.boot.dto.ChemicalDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface ChemicalMapper extends BaseMapper {

    @Mapping(source = "material.id", target = "materialId")
    ChemicalDto toDto(Chemical entity);

    @Mapping(target = "material", ignore = true)
    @Mapping(target = "material.id", source = "materialId")
    Chemical toEntity(ChemicalDto dto);
}