package com.disputeshield.backend.exception;

/** Thrown when a dispute id doesn't exist. Mapped to 404 by GlobalExceptionHandler. */
public class DisputeNotFoundException extends RuntimeException {
    public DisputeNotFoundException(String disputeId) {
        super("No dispute found with id: " + disputeId);
    }
}
