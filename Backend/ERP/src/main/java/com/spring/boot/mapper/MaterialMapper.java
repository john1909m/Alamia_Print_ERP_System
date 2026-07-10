package com.spring.boot.mapper;

import com.spring.boot.model.Material;
import com.spring.boot.dto.MaterialDto;
import org.mapstruct.Mapper;

/**
 * Mapper for converting between Material entity and MaterialDto.
 */
@Mapper(componentModel = "spring", uses = {PaperMapper.class, InkMapper.class, ChemicalMapper.class, ProductionOrderMapper.class})
public interface MaterialMapper extends BaseMapper {
    MaterialDto toDto(Material entity);
    Material toEntity(MaterialDto dto);
}