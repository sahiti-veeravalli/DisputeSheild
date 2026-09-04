package com.disputeshield.backend.dto;

import com.disputeshield.backend.domain.Role;
import com.disputeshield.backend.domain.User;

import java.time.Instant;

public record UserDto(
        Long id,
        String name,
        String email,
        Role role,
        Instant createdAt
) {
    public static UserDto fromEntity(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
