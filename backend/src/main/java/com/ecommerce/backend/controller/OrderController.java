package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.common.PageResponse;
import com.ecommerce.backend.dto.order.OrderResponse;
import com.ecommerce.backend.dto.order.PlaceOrderRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@AuthenticationPrincipal User user,
                                                    @Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(user, request));
    }

    @GetMapping("/me")
    public ResponseEntity<PageResponse<OrderResponse>> getOrderHistory(@AuthenticationPrincipal User user,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(orderService.getOrderHistory(user, page, size));
    }
}
