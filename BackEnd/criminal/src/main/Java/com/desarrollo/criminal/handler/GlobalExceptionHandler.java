package com.desarrollo.criminal.handler;

import com.desarrollo.criminal.dto.response.ApiError;
import com.desarrollo.criminal.exception.CriminalCrossException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    private ResponseEntity<ApiError> handlerEntityNotFoundException(EntityNotFoundException e){
        log.error(String.valueOf(e));

        ApiError apiError = new ApiError("Entity not found", e.getMessage(), BAD_REQUEST.value());

        return ResponseEntity.status(apiError.status()).body(apiError);
    }

    @ExceptionHandler(CriminalCrossException.class)
    private ResponseEntity<ApiError> handlerCriminalCrossException(CriminalCrossException e){
        log.error(String.valueOf(e));

        ApiError apiError = new ApiError(e.getCode(), e.getMessage(), BAD_REQUEST.value());

        return ResponseEntity.status(apiError.status()).body(apiError);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    private ResponseEntity<ApiError> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e){
        log.error(String.valueOf(e));

        ApiError apiError = new ApiError("Validation error", e.getMessage(), BAD_REQUEST.value());

        return ResponseEntity.status(apiError.status()).body(apiError);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    private ResponseEntity<ApiError> handlerHttpMessageNotReadableException(HttpMessageNotReadableException e){
        log.error(String.valueOf(e));

        ApiError apiError = new ApiError("Malformed JSON request", e.getMessage(), BAD_REQUEST.value());

        return ResponseEntity.status(BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(Exception.class)
    private ResponseEntity<ApiError> handlerException(Exception e){
        log.error(String.valueOf(e));

        ApiError apiError = new ApiError("Internal server error", e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());

        return ResponseEntity.status(apiError.status()).body(apiError);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    private ResponseEntity<ApiError> handlerDataIntegrityViolationException(DataIntegrityViolationException e){
        log.error(String.valueOf(e));

        ApiError apiError = new ApiError("Data integrity violation", e.getMessage(), BAD_REQUEST.value());

        return ResponseEntity.status(BAD_REQUEST).body(apiError);
    }

}
