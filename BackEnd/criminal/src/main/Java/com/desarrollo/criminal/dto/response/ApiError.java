package com.desarrollo.criminal.dto.response;

public record ApiError(String error, String message, Integer status) {
}
