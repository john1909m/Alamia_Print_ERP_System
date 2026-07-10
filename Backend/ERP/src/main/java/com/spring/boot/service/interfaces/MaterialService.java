package com.spring.boot.service.interfaces;

import com.spring.boot.dto.MaterialDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for Material entity.
 */
public interface MaterialService {
    MaterialDto create(MaterialDto materialDto);
    MaterialDto update(Long id, MaterialDto materialDto);
    void delete(Long id);
    MaterialDto findById(Long id);
    List<MaterialDto> findAll();
    Page<MaterialDto> findAll(Pageable pageable);
}