package com.spring.boot.mapper;

import com.spring.boot.model.Ink;
import com.spring.boot.dto.InkDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for converting between Ink entity and InkDto.
 */
@Mapper(componentModel = "spring")
public interface InkMapper extends BaseMapper {

    @Mapping(source = "material.id", target = "material.id") // This might need adjustment
    InkDto toDto(Ink entity);

    @Mapping(target = "material", ignore = true)
    Ink toEntity(InkDto dto);
}