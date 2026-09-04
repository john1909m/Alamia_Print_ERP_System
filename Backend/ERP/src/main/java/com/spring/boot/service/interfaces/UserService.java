package com.spring.boot.service.interfaces;

import com.spring.boot.dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> getUsers();
    UserDto addUser(UserDto userDto);
    void updateUser(Long userId,UserDto userDto);
    void deleteUser(Long userId);


}
