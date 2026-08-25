package com.spring.boot.controller;

import com.spring.boot.controller.vm.LoginRequestVM;
import com.spring.boot.controller.vm.LoginResponseVM;
import com.spring.boot.dto.UserDto;
import com.spring.boot.service.interfaces.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.SystemException;
import jakarta.validation.Valid;
//import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
//import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174/")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody @Valid UserDto userDto) throws SystemException{
        authService.signUp(userDto);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseVM> login(@RequestBody @Valid LoginRequestVM loginRequestVM, HttpServletResponse response) throws SystemException{

        return ResponseEntity.ok(authService.login(loginRequestVM, response));

    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDto user = (UserDto) authentication.getPrincipal();
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request,
                                         HttpServletResponse response) {

        authService.logout(request, response);
        return ResponseEntity.ok("Logged.out.successfully");
    }

}
