package com.spring.boot.service.impl;

import com.spring.boot.dto.UserDto;
import com.spring.boot.enums.Role;
import com.spring.boot.exception.ResourceNotFoundException;
import com.spring.boot.mapper.UserMapper;
import com.spring.boot.model.User;
import com.spring.boot.repo.UserRepo;
import com.spring.boot.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
//import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserDto> getUsers() {
        List<User> users = userRepo.findAll();
        List<UserDto> userDtos = users.stream()
                .map(user -> {
                    UserDto dto = userMapper.toDto(user);
                    dto.setPassword(null); // ✅ إخفاء كلمة المرور
                    return dto;
                })
                .collect(Collectors.toList());
        return userDtos;
    }

    @Override
    public UserDto addUser(UserDto userDto) {
        if (userDto.getName() == null || userDto.getName().trim().isEmpty()) {
            throw new RuntimeException("Name.is.required");
        }

        if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email.is.required");
        }

        if (userDto.getPassword() == null || userDto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password.is.required");
        }

        if (userDto.getRole() == null) {
            throw new RuntimeException("Role.is.required");
        }

        // 2. Validate name length
        if (userDto.getName().length() < 2) {
            throw new RuntimeException("Name.must be.at.least.2.characters");
        }
        if (userDto.getName().length() > 100) {
            throw new RuntimeException("Name.must.not.exceed.100.characters");
        }

        // 3. Validate email format
        if (!isValidEmail(userDto.getEmail())) {
            throw new RuntimeException("Invalid.email.format");
        }

        // 4. Validate email is not already used
        if (userRepo.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email.is.already.registered");
        }

        // 5. Validate phone number (if provided)
        if (userDto.getPhoneNumber() != null && !userDto.getPhoneNumber().trim().isEmpty()) {
            String phone = userDto.getPhoneNumber().replaceAll("[\\s-]", "");
            if (!isValidPhoneNumber(phone)) {
                throw new RuntimeException("Invalid.phone.number.format");
            }
        }

        // 6. Validate password strength
        if (userDto.getPassword().length() < 8) {
            throw new RuntimeException("Password.must.be.at.least.8.characters");
        }



        // 8. Create and save user
        User newUser = new User();
        newUser.setName(userDto.getName().trim());
        newUser.setEmail(userDto.getEmail().trim().toLowerCase());
        newUser.setRole(userDto.getRole());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setPhoneNumber(userDto.getPhoneNumber() != null ? userDto.getPhoneNumber().trim() : null);
        newUser.setCreatedAt(LocalDateTime.now());

        userRepo.save(newUser);

        // 9. Set ID and return
        userDto.setId(newUser.getId());
        userDto.setCreatedAt(newUser.getCreatedAt());

        return userDto;
    }


    private boolean isValidEmail(String email) {
        if (email == null) return false;
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }

    private boolean isValidPhoneNumber(String phone) {
        if (phone == null) return false;
        // Egyptian phone numbers: +20 or 0 followed by 10-11 digits
        String phoneRegex = "^(\\+20|0)?1[0125]\\d{8}$";
        return phone.matches(phoneRegex);
    }



    @Override
    public void updateUser(Long userId, UserDto userDto) {
        // 1. Check if user exists
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User.not.found.with.this.id"));

        // 2. Validate and update fields
        if (userDto.getName() != null && !userDto.getName().trim().isEmpty()) {
            if (userDto.getName().length() < 2) {
                throw new RuntimeException("Name.must.be.at.least.2.characters");
            }
            if (userDto.getName().length() > 100) {
                throw new RuntimeException("Name.must.not.exceed.100.characters");
            }
            existingUser.setName(userDto.getName().trim());
        }

        if (userDto.getEmail() != null && !userDto.getEmail().trim().isEmpty()) {
            String email = userDto.getEmail().trim().toLowerCase();

            // Validate email format
            if (!isValidEmail(email)) {
                throw new RuntimeException("Invalid.email.format");
            }

            // Check if email is already used by another user
            User userWithEmail = userRepo.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User.not.found.with.this.id"));
            if (!userWithEmail.getId().equals(userId)) {
                throw new RuntimeException("Email.is.already.registered.to.another.user");
            }

            existingUser.setEmail(email);
        }

        if (userDto.getPhoneNumber() != null && !userDto.getPhoneNumber().trim().isEmpty()) {
            String phone = userDto.getPhoneNumber().replaceAll("[\\s-]", "");
            if (!isValidPhoneNumber(phone)) {
                throw new RuntimeException("Invalid.phone.number.format");
            }
            existingUser.setPhoneNumber(userDto.getPhoneNumber().trim());
        } else if (userDto.getPhoneNumber() != null) {
            // If phoneNumber is passed as empty string, set to null
            existingUser.setPhoneNumber(null);
        }

        if (userDto.getPassword() != null && !userDto.getPassword().trim().isEmpty()) {
            if (userDto.getPassword().length() < 6) {
                throw new RuntimeException("Password.must.be.at.least.6.characters");
            }
            if (userDto.getPassword().length() > 50) {
                throw new RuntimeException("Password.must.not.exceed.50.characters");
            }
            existingUser.setPassword(userDto.getPassword());
        }

        if (userDto.getRole() != null) {
            existingUser.setRole(userDto.getRole());
        }

        // 3. Update timestamp
        existingUser.setUpdatedAt(LocalDateTime.now());

        // 4. Save updated user
        userRepo.save(existingUser);
    }

    @Override
    public void deleteUser(Long userId) {
        User existingUser=userRepo.findById(userId).orElseThrow(() ->
                new ResourceNotFoundException("User.not.found.with.this.id"));
        userRepo.deleteById(userId);

    }
}
