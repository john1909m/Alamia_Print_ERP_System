package com.spring.boot.mapper;

import com.spring.boot.model.Paper;
import com.spring.boot.dto.PaperDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for converting between Paper entity and PaperDto.
 */
@Mapper(componentModel = "spring", uses = {MaterialMapper.class, ProductionOrderMapper.class})
public interface PaperMapper extends BaseMapper {
    @Mapping(source = "material.id",target = "material_id")
    @Mapping(source = "material.name",target = "name")
    PaperDto toDto(Paper entity);

    @Mapping(target = "material", ignore = true)
    Paper toEntity(PaperDto dto);
}