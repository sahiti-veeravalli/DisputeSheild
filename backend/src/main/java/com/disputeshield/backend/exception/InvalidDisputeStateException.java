package com.disputeshield.backend.exception;

/**
 * Thrown when an action is requested out of order — e.g. fetching /analysis or
 * generating a /packet before /analyze has ever run for that dispute. Mapped to 400 by
 * GlobalExceptionHandler.
 */
public class InvalidDisputeStateException extends RuntimeException {
    public InvalidDisputeStateException(String message) {
        super(message);
    }
}
