package com.ecommerce.backend.dto.cart;

import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;

@Builder
public record CartResponse(
        Long id,
        Long userId,
        List<CartItemResponse> items,
        BigDecimal totalAmount
) {
}
