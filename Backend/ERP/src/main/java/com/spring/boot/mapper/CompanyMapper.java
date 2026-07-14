package com.spring.boot.mapper;

import com.spring.boot.model.Company;
import com.spring.boot.dto.CompanyDto;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

/**
 * Mapper for converting between Company entity and CompanyDto.
 */
@Mapper(componentModel = "spring", uses = {ProductMapper.class, ProductionOrderMapper.class})
public interface CompanyMapper extends BaseMapper {
    CompanyDto toDto(Company entity);
    Company toEntity(CompanyDto dto);

    void updateEntityFromDto(CompanyDto dto, @MappingTarget Company entity);

}