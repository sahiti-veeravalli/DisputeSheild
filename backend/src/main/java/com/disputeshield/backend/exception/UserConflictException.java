package com.disputeshield.backend.exception;

/**
 * Thrown when an attempt is made to register a user with an existing email address.
 * Mapped to 409 Conflict.
 */
public class UserConflictException extends RuntimeException {
    public UserConflictException(String message) {
        super(message);
    }
}
