package com.spring.boot.mapper;

import com.spring.boot.model.Paper;
import com.spring.boot.dto.PaperDto;
import org.mapstruct.Mapper;

/**
 * Mapper for converting between Paper entity and PaperDto.
 */
@Mapper(componentModel = "spring", uses = {MaterialMapper.class, ProductionOrderMapper.class})
public interface PaperMapper extends BaseMapper {
    PaperDto toDto(Paper entity);
    Paper toEntity(PaperDto dto);
}