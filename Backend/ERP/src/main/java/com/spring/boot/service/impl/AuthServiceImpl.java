package com.spring.boot.service.impl;

import com.spring.boot.config.jwt.TokenHandler;
import com.spring.boot.controller.vm.LoginRequestVM;
import com.spring.boot.controller.vm.LoginResponseVM;
import com.spring.boot.dto.UserDto;
import com.spring.boot.mapper.UserMapper;
import com.spring.boot.model.User;
import com.spring.boot.repo.UserRepo;
import com.spring.boot.service.interfaces.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.SystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TokenHandler tokenHandler;

    @Override
    public void signUp(UserDto userDto) throws SystemException {
        User user=userMapper.toEntity(userDto);
        User savedUser=userRepo.save(user);
    }

    @Override
    public LoginResponseVM login(LoginRequestVM loginRequestVm, HttpServletResponse response) throws SystemException {
        User user = userRepo.findByEmail(loginRequestVm.getEmail())
                .orElseThrow(() -> new RuntimeException("User.not.found"));
        UserDto userDto = userMapper.toDto(user);
        String token = tokenHandler.createToken(userDto);

        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24); // 1 day
        // For localhost development with cross-origin (different ports):
        // Modern browsers allow SameSite=None without Secure for localhost
        cookie.setAttribute("SameSite", "Lax");

        response.addCookie(cookie);

        // Also return token in response body for frontend compatibility
        return new LoginResponseVM(token, userDto);
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {

        // 🔹 مسح الكوكي
        Cookie cookie = new Cookie("access_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true في production مع HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(0); // 👈 delete

        response.addCookie(cookie);

        // 🔹 clear spring security context
        SecurityContextHolder.clearContext();

        // 🔹 invalidate session لو موجودة
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

}
