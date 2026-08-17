package com.spring.boot.dto;

import com.spring.boot.enums.Role;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserDto {
    private Long id;

    private String name;

    private String password;

    private String email;

    private String phoneNumber;

    private Role role;
}
