package com.spring.boot.service.impl;

import com.spring.boot.controller.vm.LoginRequestVM;
import com.spring.boot.controller.vm.LoginResponseVM;
import com.spring.boot.dto.UserDto;
import com.spring.boot.mapper.UserMapper;
import com.spring.boot.model.User;
import com.spring.boot.repo.UserRepo;
import com.spring.boot.service.interfaces.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.SystemException;

public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final UserRepo userRepo;

    @Override
    public void signUp(UserDto userDto) throws SystemException {
        User user=userMapper.toEntity(userDto);
        User savedUser=userRepo.saveAndFlush(user);
    }

    @Override
    public LoginResponseVM login(LoginRequestVM loginRequestVm, HttpServletResponse response) throws SystemException {
        User user = userRepo.findByEmail(loginRequestVm.getEmail())
                .orElseThrow(() -> new RuntimeException("User.not.found"));
        UserDto userDto = userMapper.toDto(user);
        return new LoginResponseVM(userDto);
    }
}
