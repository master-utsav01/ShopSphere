package com.ecommerce.backend.dto.admin;

import com.ecommerce.backend.entity.Role;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record AdminUserResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        LocalDateTime createdAt,
        int totalOrders
) {
}
