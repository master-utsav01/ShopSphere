package com.ecommerce.backend.dto.user;

import com.ecommerce.backend.entity.Role;
import lombok.Builder;

@Builder
public record UserResponse(
        Long id,
        String fullName,
        String email,
        Role role
) {
}
