package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.cart.AddCartItemRequest;
import com.ecommerce.backend.dto.cart.CartResponse;
import com.ecommerce.backend.dto.cart.UpdateCartItemRequest;
import com.ecommerce.backend.entity.User;

public interface CartService {

    CartResponse getCart(User user);

    CartResponse addItemToCart(User user, AddCartItemRequest request);

    CartResponse updateCartItem(User user, Long itemId, UpdateCartItemRequest request);

    CartResponse removeCartItem(User user, Long itemId);

    void clearCart(User user);
}
