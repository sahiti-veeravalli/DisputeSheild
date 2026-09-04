package com.disputeshield.backend.dto;

public record AuthResponseDto(
        String token,
        UserDto user
) {
}
