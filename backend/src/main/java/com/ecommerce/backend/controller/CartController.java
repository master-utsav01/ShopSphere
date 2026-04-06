package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.cart.AddCartItemRequest;
import com.ecommerce.backend.dto.cart.CartResponse;
import com.ecommerce.backend.dto.cart.UpdateCartItemRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(@AuthenticationPrincipal User user,
                                                      @Valid @RequestBody AddCartItemRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(user, request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(@AuthenticationPrincipal User user,
                                                       @PathVariable Long itemId,
                                                       @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(user, itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeCartItem(@AuthenticationPrincipal User user, @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeCartItem(user, itemId));
    }
}
