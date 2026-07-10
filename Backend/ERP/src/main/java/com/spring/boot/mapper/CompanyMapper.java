package com.spring.boot.mapper;

import com.spring.boot.model.Company;
import com.spring.boot.dto.CompanyDto;
import org.mapstruct.Mapper;

/**
 * Mapper for converting between Company entity and CompanyDto.
 */
@Mapper(componentModel = "spring", uses = {ProductMapper.class, ProductionOrderMapper.class})
public interface CompanyMapper extends BaseMapper {
    CompanyDto toDto(Company entity);
    Company toEntity(CompanyDto dto);
}