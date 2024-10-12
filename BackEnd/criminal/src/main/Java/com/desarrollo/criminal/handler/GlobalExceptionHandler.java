package com.desarrollo.criminal.handler;

import com.desarrollo.criminal.dto.response.ApiError;
import com.desarrollo.criminal.exception.CriminalCrossException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(EntityNotFoundException.class)
    private ResponseEntity<ApiError> handlerEntityNotFoundException(EntityNotFoundException e){
        log.error(String.valueOf(e));

        ApiError apiError = new ApiError("Entity not found", e.getMessage(), BAD_REQUEST.value());

        return ResponseEntity.status(apiError.status()).body(apiError);
    }

    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(CriminalCrossException.class)
    private ResponseEntity<ApiError> handlerCriminalCrossException(CriminalCrossException e){
        log.error(String.valueOf(e));

        ApiError apiError = new ApiError(e.getCode(), e.getMessage(), BAD_REQUEST.value());

        return ResponseEntity.status(apiError.status()).body(apiError);
    }
}
