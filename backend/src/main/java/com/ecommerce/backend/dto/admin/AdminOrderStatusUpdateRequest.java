package com.ecommerce.backend.dto.admin;

import com.ecommerce.backend.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record AdminOrderStatusUpdateRequest(
        @NotNull(message = "Order status is required")
        OrderStatus status
) {
}
