package com.spring.boot.mapper;

import com.spring.boot.model.Chemical;
import com.spring.boot.dto.ChemicalDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for converting between Chemical entity and ChemicalDto.
 */
@Mapper(componentModel = "spring")
public interface ChemicalMapper extends BaseMapper {

    @Mapping(source = "material.id", target = "material_id")
    ChemicalDto toDto(Chemical entity);

    @Mapping(target = "material", ignore = true)
    Chemical toEntity(ChemicalDto dto);
}