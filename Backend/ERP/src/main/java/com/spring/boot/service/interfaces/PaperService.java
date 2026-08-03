package com.spring.boot.service.interfaces;

import com.spring.boot.dto.PaperDto;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for Paper entity.
 */
public interface PaperService {
    PaperDto create(PaperDto paperDto);
    PaperDto update(Long id, PaperDto paperDto);
    void delete(Long id);
    PaperDto findById(Long id);
    List<PaperDto> findAll();
    Page<PaperDto> findAll(Pageable pageable);
    Void adjustStock(Long id,String operation,Double number);
}