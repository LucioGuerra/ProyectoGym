package com.desarrollo.criminal.handler;

import com.desarrollo.criminal.exception.CriminalCrossException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handlerEntityNotFoundException(EntityNotFoundException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }

    @ExceptionHandler(CriminalCrossException.class)
    public ResponseEntity<String> handlerCriminalCrossException(CriminalCrossException e){
        return ResponseEntity.status(400).body(e.getMessage());
    }
}
