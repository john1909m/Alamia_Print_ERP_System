package com.spring.boot.controller;

import com.spring.boot.dto.UserDto;
import jakarta.transaction.SystemException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5174/")
public class AuthController {

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody @Valid UserDto userDto) throws SystemException{
        return ResponseEntity.ok().build();
    }
}
