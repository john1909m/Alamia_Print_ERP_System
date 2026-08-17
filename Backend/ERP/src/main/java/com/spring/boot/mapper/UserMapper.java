package com.spring.boot.mapper;

import com.spring.boot.dto.UserDto;
import com.spring.boot.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface UserMapper {
    UserDto toDto(User user);
    User toEntity(UserDto userDto);
}
