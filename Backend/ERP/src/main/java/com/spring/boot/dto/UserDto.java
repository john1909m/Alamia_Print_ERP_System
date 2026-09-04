package com.spring.boot.dto;

import com.spring.boot.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;

    private String name;

    private String password;

    private String email;

    private String phoneNumber;

    private Role role;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
