package com.disputeshield.backend.web;

import com.disputeshield.backend.dto.AuthResponseDto;
import com.disputeshield.backend.dto.LoginRequestDto;
import com.disputeshield.backend.dto.RegisterRequestDto;
import com.disputeshield.backend.dto.UserDto;
import com.disputeshield.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, JWT login, and current profile")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register new account", description = "Creates a new user account with BCrypt password hashing and returns an initial JWT access token.")
    public AuthResponseDto register(@Valid @RequestBody RegisterRequestDto request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Sign in", description = "Authenticates user credentials and returns a signed JWT access token and user profile.")
    public AuthResponseDto login(@Valid @RequestBody LoginRequestDto request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Returns the profile and role of the currently authenticated user based on the JWT Bearer token.",
            security = @SecurityRequirement(name = "BearerAuth"))
    public UserDto getCurrentUser(Principal principal, Authentication authentication) {
        if (principal == null && authentication == null) {
            throw new org.springframework.security.access.AccessDeniedException("User is not authenticated");
        }
        String email = principal != null ? principal.getName() : (String) authentication.getPrincipal();
        return authService.getCurrentUser(email);
    }
}
