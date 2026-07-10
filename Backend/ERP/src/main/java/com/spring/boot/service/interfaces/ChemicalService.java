package com.spring.boot.service.interfaces;

import com.spring.boot.dto.ChemicalDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for Chemical entity.
 */
public interface ChemicalService {
    ChemicalDto create(ChemicalDto chemicalDto);
    ChemicalDto update(Long id, ChemicalDto chemicalDto);
    void delete(Long id);
    ChemicalDto findById(Long id);
    List<ChemicalDto> findAll();
    Page<ChemicalDto> findAll(Pageable pageable);
}