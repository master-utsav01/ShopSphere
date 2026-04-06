package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.cart.AddCartItemRequest;
import com.ecommerce.backend.dto.cart.CartItemResponse;
import com.ecommerce.backend.dto.cart.CartResponse;
import com.ecommerce.backend.dto.cart.UpdateCartItemRequest;
import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.service.CartService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(User user) {
        return toResponse(getOrCreateCart(user));
    }

    @Override
    @Transactional
    public CartResponse addItemToCart(User user, AddCartItemRequest request) {
        Cart cart = getOrCreateCart(user);
        Product product = findProduct(request.productId());

        if (Boolean.FALSE.equals(product.getActive())) {
            throw new BadRequestException("Cannot add inactive product to cart");
        }
        if (product.getStockQuantity() < request.quantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock");
        }

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseGet(() -> CartItem.builder().cart(cart).product(product).quantity(0).build());
        if (cartItem.getId() == null) {
            cart.getCartItems().add(cartItem);
        }

        int newQuantity = cartItem.getQuantity() + request.quantity();
        if (product.getStockQuantity() < newQuantity) {
            throw new BadRequestException("Requested quantity exceeds available stock");
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);
        return toResponse(getOrCreateCart(user));
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(User user, Long itemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(user);
        CartItem cartItem = findCartItem(itemId);
        validateOwnership(cart, cartItem);

        if (cartItem.getProduct().getStockQuantity() < request.quantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock");
        }

        cartItem.setQuantity(request.quantity());
        cartItemRepository.save(cartItem);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeCartItem(User user, Long itemId) {
        Cart cart = getOrCreateCart(user);
        CartItem cartItem = findCartItem(itemId);
        validateOwnership(cart, cartItem);
        cart.getCartItems().removeIf(item -> item.getId().equals(cartItem.getId()));
        cartItemRepository.delete(cartItem);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).cartItems(new ArrayList<>()).build()));
    }

    private Product findProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }

    private CartItem findCartItem(Long itemId) {
        return cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));
    }

    private void validateOwnership(Cart cart, CartItem cartItem) {
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to the authenticated user");
        }
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getCartItems().stream()
                .map(item -> {
                    BigDecimal subtotal = item.getProduct().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    return CartItemResponse.builder()
                            .id(item.getId())
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .imageUrl(item.getProduct().getImageUrl())
                            .price(item.getProduct().getPrice())
                            .quantity(item.getQuantity())
                            .subtotal(subtotal)
                            .build();
                })
                .toList();

        BigDecimal total = items.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .totalAmount(total)
                .build();
    }
}
