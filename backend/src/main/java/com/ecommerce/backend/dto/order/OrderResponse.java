package com.ecommerce.backend.dto.order;

import com.ecommerce.backend.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;

@Builder
public record OrderResponse(
        Long id,
        OrderStatus status,
        BigDecimal totalAmount,
        String shippingAddress,
        String paymentMethod,
        String locationLabel,
        Double latitude,
        Double longitude,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
}
