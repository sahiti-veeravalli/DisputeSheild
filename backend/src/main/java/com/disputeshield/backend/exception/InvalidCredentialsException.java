package com.disputeshield.backend.exception;

/**
 * Thrown when an invalid email or password is provided during login.
 * Mapped to 401 Unauthorized.
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
