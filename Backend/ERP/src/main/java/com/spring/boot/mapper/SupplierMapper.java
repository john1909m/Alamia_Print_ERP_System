package com.spring.boot.mapper;

import com.spring.boot.model.Supplier;
import com.spring.boot.dto.SupplierDto;
import org.mapstruct.Mapper;

/**
 * Mapper for converting between Supplier entity and SupplierDto.
 */
@Mapper(componentModel = "spring", uses = {})
public interface SupplierMapper extends BaseMapper {
    SupplierDto toDto(Supplier entity);
    Supplier toEntity(SupplierDto dto);
}