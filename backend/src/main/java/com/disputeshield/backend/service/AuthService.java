package com.disputeshield.backend.service;

import com.disputeshield.backend.config.JwtService;
import com.disputeshield.backend.domain.Role;
import com.disputeshield.backend.domain.User;
import com.disputeshield.backend.dto.AuthResponseDto;
import com.disputeshield.backend.dto.LoginRequestDto;
import com.disputeshield.backend.dto.RegisterRequestDto;
import com.disputeshield.backend.dto.UserDto;
import com.disputeshield.backend.exception.InvalidCredentialsException;
import com.disputeshield.backend.exception.UserConflictException;
import com.disputeshield.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponseDto register(RegisterRequestDto request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new UserConflictException("An account with email " + request.email() + " already exists.");
        }

        Role role = request.role() != null ? request.role() : Role.INVESTIGATOR;
        String hashedPassword = passwordEncoder.encode(request.password());

        User user = new User(
                request.name().trim(),
                normalizedEmail,
                hashedPassword,
                role
        );

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);

        return new AuthResponseDto(token, UserDto.fromEntity(saved));
    }

    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponseDto(token, UserDto.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("User not found for email: " + email));
        return UserDto.fromEntity(user);
    }
}
