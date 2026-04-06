package com.ecommerce.backend.dto.admin;

import com.ecommerce.backend.dto.order.OrderItemResponse;
import com.ecommerce.backend.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record AdminOrderResponse(
        Long id,
        OrderStatus status,
        BigDecimal totalAmount,
        String shippingAddress,
        String paymentMethod,
        String locationLabel,
        Double latitude,
        Double longitude,
        LocalDateTime createdAt,
        Long userId,
        String userName,
        String userEmail,
        List<OrderItemResponse> items
) {
}
