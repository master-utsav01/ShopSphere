package com.ecommerce.backend.dto.auth;

import com.ecommerce.backend.dto.user.UserResponse;
import lombok.Builder;

@Builder
public record AuthResponse(
        String token,
        UserResponse user
) {
}
