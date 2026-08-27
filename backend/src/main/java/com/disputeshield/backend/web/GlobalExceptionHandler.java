package com.disputeshield.backend.web;

import com.disputeshield.backend.dto.ApiErrorDto;
import com.disputeshield.backend.exception.DisputeConflictException;
import com.disputeshield.backend.exception.DisputeNotFoundException;
import com.disputeshield.backend.exception.InvalidDisputeStateException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.NoSuchElementException;

/** Centralizes error handling for the dispute API so callers always get a small,
 * consistent {"error": "..."} JSON body instead of a stack trace. */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({DisputeNotFoundException.class, NoSuchElementException.class})
    public ResponseEntity<ApiErrorDto> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiErrorDto(ex.getMessage()));
    }

    @ExceptionHandler(InvalidDisputeStateException.class)
    public ResponseEntity<ApiErrorDto> handleInvalidState(InvalidDisputeStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiErrorDto(ex.getMessage()));
    }

    @ExceptionHandler(DisputeConflictException.class)
    public ResponseEntity<ApiErrorDto> handleConflict(DisputeConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiErrorDto(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDto> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getField() + " " + fe.getDefaultMessage())
                .orElse("Invalid request body.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiErrorDto(message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDto> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiErrorDto(ex.getMessage()));
    }
}
