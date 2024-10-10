package com.desarrollo.criminal.dto.request;

import com.desarrollo.criminal.entity.user.Role;

public record UserUpdateDTO(String firstName, String lastName, String email, String dni, String phone, Role role) {
}
