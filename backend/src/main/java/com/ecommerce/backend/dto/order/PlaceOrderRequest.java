package com.ecommerce.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PlaceOrderRequest(
        @NotBlank(message = "Shipping address is required")
        @Size(min = 10, max = 255, message = "Shipping address must be between 10 and 255 characters")
        String shippingAddress,

        @NotBlank(message = "Payment method is required")
        @Size(min = 3, max = 60, message = "Payment method must be between 3 and 60 characters")
        String paymentMethod,

        @Size(max = 255, message = "Location label must not exceed 255 characters")
        String locationLabel,

        Double latitude,

        Double longitude
) {
}
