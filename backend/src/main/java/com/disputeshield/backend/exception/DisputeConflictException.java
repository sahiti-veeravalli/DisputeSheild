package com.disputeshield.backend.exception;

/** Thrown when an action conflicts with the dispute's current state — e.g. re-submitting
 * an already-submitted case. Mapped to 409 by GlobalExceptionHandler. */
public class DisputeConflictException extends RuntimeException {
    public DisputeConflictException(String message) {
        super(message);
    }
}
