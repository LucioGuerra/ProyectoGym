package com.desarrollo.criminal.exception;

import lombok.Getter;

@Getter
public class CriminalCrossException extends RuntimeException{

    private final String code;

    public CriminalCrossException(String code, String message){
        super(message);
        this.code = code;
    }

    public CriminalCrossException(String code, String message, Throwable cause){
        super(message, cause);
        this.code = code;
    }
}
