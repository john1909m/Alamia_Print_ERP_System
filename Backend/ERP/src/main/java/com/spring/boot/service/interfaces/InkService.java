package com.spring.boot.service.interfaces;

import com.spring.boot.dto.InkDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for Ink entity.
 */
public interface InkService {
    InkDto create(InkDto inkDto);
    InkDto update(Long id, InkDto inkDto);
    void delete(Long id);
    InkDto findById(Long id);
    List<InkDto> findAll();
    Page<InkDto> findAll(Pageable pageable);
    Void adjustStock(Long id,String operation,Double number);

}