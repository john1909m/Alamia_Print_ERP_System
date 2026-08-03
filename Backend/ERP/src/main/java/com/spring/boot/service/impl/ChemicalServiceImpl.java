package com.spring.boot.service.impl;

import com.spring.boot.dto.ChemicalDto;
import com.spring.boot.mapper.ChemicalMapper;
import com.spring.boot.model.Chemical;
import com.spring.boot.model.Paper;
import com.spring.boot.repo.ChemicalRepository;
import com.spring.boot.service.interfaces.ChemicalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Chemical entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChemicalServiceImpl implements ChemicalService {

    private final ChemicalRepository chemicalRepository;
    private final ChemicalMapper chemicalMapper;

    @Override
    public ChemicalDto create(ChemicalDto chemicalDto) {
        Chemical chemical = chemicalMapper.toEntity(chemicalDto);
        Chemical savedChemical = chemicalRepository.save(chemical);
        log.info("Chemical created successfully with id: {}", savedChemical.getId());
        return chemicalMapper.toDto(savedChemical);
    }

    @Override
    public ChemicalDto update(Long id, ChemicalDto chemicalDto) {
        log.info("Updating chemical with id: {}", id);
        Chemical existing = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chemical not found with id: " + id));
        Chemical chemicalToUpdate = chemicalMapper.toEntity(chemicalDto);
        chemicalToUpdate.setId(existing.getId());
        Chemical updatedChemical = chemicalRepository.save(chemicalToUpdate);
        log.info("Chemical updated successfully with id: {}", updatedChemical.getId());
        return chemicalMapper.toDto(updatedChemical);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting chemical with id: {}", id);
        chemicalRepository.deleteById(id);
        log.info("Chemical deleted successfully with id: {}", id);
    }

    @Override
    public ChemicalDto findById(Long id) {
        log.info("Fetching chemical with id: {}", id);
        Chemical chemical = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chemical not found with id: " + id));
        log.info("Chemical found: {}", chemical.getMaterial().getName());
        return chemicalMapper.toDto(chemical);
    }

    @Override
    public List<ChemicalDto> findAll() {
        log.info("Fetching all chemicals");
        List<ChemicalDto> chemicals = chemicalRepository.findAll().stream()
                .map(chemicalMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} chemicals", chemicals.size());
        return chemicals;
    }

    @Override
    public Page<ChemicalDto> findAll(Pageable pageable) {
        log.info("Fetching paginated chemicals with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<ChemicalDto> chemicals = chemicalRepository.findAll(pageable)
                .map(chemicalMapper::toDto);
        log.info("Found {} chemicals (total pages: {}, total elements: {})",
                chemicals.getContent().size(),
                chemicals.getTotalPages(),
                chemicals.getTotalElements());
        return chemicals;
    }

    @Override
    public Void adjustStock(Long id,String operation,Double number) {
        Chemical existing = chemicalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found with id: " + id));
        if(operation.equals("deduct")){
            Double stock=existing.getStock();
            if (stock>=number) {
                Double newStock=stock-number;
                existing.setStock(newStock);
                Chemical updatedPaper = chemicalRepository.save(existing);
            }
            else {
                throw new RuntimeException("low stock");
            }

        } else if (operation.equals("refund")) {
            Double stock=existing.getStock();
            if (stock>=number) {
                Double newStock=stock+number;
                existing.setStock(newStock);
                Chemical updatedPaper = chemicalRepository.save(existing);
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