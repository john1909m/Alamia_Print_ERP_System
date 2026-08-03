package com.spring.boot.service.impl;

import com.spring.boot.dto.PaperDto;
import com.spring.boot.mapper.PaperMapper;
import com.spring.boot.model.Paper;
import com.spring.boot.repo.PaperRepository;
import com.spring.boot.service.interfaces.PaperService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for Paper entity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaperServiceImpl implements PaperService {

    private final PaperRepository paperRepository;
    private final PaperMapper paperMapper;

    @Override
    public PaperDto create(PaperDto paperDto) {
        Paper paper = paperMapper.toEntity(paperDto);
        Paper savedPaper = paperRepository.save(paper);
        log.info("Paper created successfully with id: {}", savedPaper.getId());
        return paperMapper.toDto(savedPaper);
    }

    @Override
    public PaperDto update(Long id, PaperDto paperDto) {
        log.info("Updating paper with id: {}", id);
        Paper existing = paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found with id: " + id));
        Paper paperToUpdate = paperMapper.toEntity(paperDto);
        paperToUpdate.setId(existing.getId());
        Paper updatedPaper = paperRepository.save(paperToUpdate);
        log.info("Paper updated successfully with id: {}", updatedPaper.getId());
        return paperMapper.toDto(updatedPaper);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting paper with id: {}", id);
        paperRepository.deleteById(id);
        log.info("Paper deleted successfully with id: {}", id);
    }

    @Override
    public PaperDto findById(Long id) {
        log.info("Fetching paper with id: {}", id);
        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found with id: " + id));
        log.info("Paper found: {}", paper.getMaterial().getName());
        return paperMapper.toDto(paper);
    }

    @Override
    public List<PaperDto> findAll() {
        log.info("Fetching all papers");
        List<PaperDto> papers = paperRepository.findAll().stream()
                .map(paperMapper::toDto)
                .collect(Collectors.toList());
        log.info("Found {} papers", papers.size());
        return papers;
    }

    @Override
    public Page<PaperDto> findAll(Pageable pageable) {
        log.info("Fetching paginated papers with page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<PaperDto> papers = paperRepository.findAll(pageable)
                .map(paperMapper::toDto);
        log.info("Found {} papers (total pages: {}, total elements: {})",
                papers.getContent().size(),
                papers.getTotalPages(),
                papers.getTotalElements());
        return papers;
    }

    @Override
    public Void adjustStock(Long id,String operation,Double number) {
        Paper existing = paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found with id: " + id));
        if(operation.equals("deduct")){
            Double stock=existing.getStock();
            if (stock>=number) {
                Double newStock=stock-number;
                existing.setStock(newStock);
                Paper updatedPaper = paperRepository.save(existing);
            }
            else {
                throw new RuntimeException("low stock");
            }

        } else if (operation.equals("refund")) {
            Double stock=existing.getStock();
            if (stock>=number) {
                Double newStock=stock-number;
                existing.setStock(newStock);
                Paper updatedPaper = paperRepository.save(existing);
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