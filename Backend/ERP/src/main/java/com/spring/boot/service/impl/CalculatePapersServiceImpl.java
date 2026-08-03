package com.spring.boot.service.impl;

import com.spring.boot.service.interfaces.CalculatePapersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CalculatePapersServiceImpl implements CalculatePapersService {

    @Override
    public Double calculateRequiredPapers(Double number,Double quantity) {
        Double requiredPapers=quantity/(number/2);

        return requiredPapers;
    }
}
