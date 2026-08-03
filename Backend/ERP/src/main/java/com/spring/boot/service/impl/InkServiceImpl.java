package com.spring.boot.service.impl;

import com.spring.boot.dto.InkDto;
import com.spring.boot.mapper.InkMapper;
import com.spring.boot.model.Ink;
import com.spring.boot.repo.InkRepository;
import com.spring.boot.service.interfaces.InkService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Ink entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InkServiceImpl implements InkService {

    private final InkRepository inkRepository;
    private final InkMapper inkMapper;

    @Override
    public InkDto create(InkDto inkDto) {
        Ink ink = inkMapper.toEntity(inkDto);
        Ink savedInk = inkRepository.save(ink);
        log.info("Ink created successfully with id: {}", savedInk.getId());
        return inkMapper.toDto(savedInk);
    }

    @Override
    public InkDto update(Long id, InkDto inkDto) {
        log.info("Updating ink with id: {}", id);
        Ink existing = inkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ink not found with id: " + id));
        Ink inkToUpdate = inkMapper.toEntity(inkDto);
        inkToUpdate.setId(existing.getId());
        Ink updatedInk = inkRepository.save(inkToUpdate);
        log.info("Ink updated successfully with id: {}", updatedInk.getId());
        return inkMapper.toDto(updatedInk);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting ink with id: {}", id);
        inkRepository.deleteById(id);
        log.info("Ink deleted successfully with id: {}", id);
    }

    @Override
    public InkDto findById(Long id) {
        log.info("Fetching ink with id: {}", id);
        Ink ink = inkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ink not found with id: " + id));
        log.info("Ink found: {}", ink.getMaterial().getName());
        return inkMapper.toDto(ink);
    }

    @Override
    public List<InkDto> findAll() {
        log.info("Fetching all inks");
        List<InkDto> inks = inkRepository.findAll().stream()
                .map(inkMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} inks", inks.size());
        return inks;
    }

    @Override
    public Page<InkDto> findAll(Pageable pageable) {
        log.info("Fetching paginated inks with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<InkDto> inks = inkRepository.findAll(pageable)
                .map(inkMapper::toDto);
        log.info("Found {} inks (total pages: {}, total elements: {})",
                inks.getContent().size(),
                inks.getTotalPages(),
                inks.getTotalElements());
        return inks;
    }


    @Override
    public Void adjustStock(Long id,String operation,Double number) {
        Ink existing = inkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found with id: " + id));
        if(operation.equals("deduct")){
            Double stock=existing.getStock();
            if (stock>=number) {
                Double newStock=stock-number;
                existing.setStock(newStock);
                Ink updatedPaper = inkRepository.save(existing);
            }
            else {
                throw new RuntimeException("low stock");
            }

        } else if (operation.equals("refund")) {
            Double stock=existing.getStock();
            if (stock>=number) {
                Double newStock=stock-number;
                existing.setStock(newStock);
                Ink updatedPaper = inkRepository.save(existing);
            }
            else {
                throw new RuntimeException("low stock");
            }
        }
        else {
            throw new RuntimeException("wrong operation");
        }

        return null;
    }

}