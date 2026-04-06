package com.ecommerce.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ecommerce.backend.dto.cart.AddCartItemRequest;
import com.ecommerce.backend.dto.cart.CartResponse;
import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.service.impl.CartServiceImpl;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    private CartServiceImpl cartService;

    @BeforeEach
    void setUp() {
        cartService = new CartServiceImpl(cartRepository, cartItemRepository, productRepository);
    }

    @Test
    void addItemToCartShouldIncreaseQuantityAndReturnUpdatedCart() {
        User user = User.builder().id(1L).email("user@shop.com").password("x").fullName("User").role(Role.USER).build();
        Cart cart = Cart.builder().id(1L).user(user).cartItems(new ArrayList<>()).build();
        Product product = Product.builder()
                .id(1L)
                .name("Headphones")
                .price(BigDecimal.valueOf(2500))
                .stockQuantity(5)
                .active(true)
                .build();
        CartItem cartItem = CartItem.builder().id(1L).cart(cart).product(product).quantity(0).build();
        cart.getCartItems().add(cartItem);

        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartAndProduct(cart, product)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);

        CartResponse response = cartService.addItemToCart(user, new AddCartItemRequest(1L, 2));

        assertThat(response.items()).hasSize(1);
        assertThat(response.items().getFirst().quantity()).isEqualTo(2);
        assertThat(response.totalAmount()).isEqualByComparingTo("5000");
    }

    @Test
    void addItemToCartShouldRejectWhenStockIsNotEnough() {
        User user = User.builder().id(1L).email("user@shop.com").password("x").fullName("User").role(Role.USER).build();
        Cart cart = Cart.builder().id(1L).user(user).cartItems(new ArrayList<>()).build();
        Product product = Product.builder()
                .id(1L)
                .name("Headphones")
                .price(BigDecimal.valueOf(2500))
                .stockQuantity(1)
                .active(true)
                .build();

        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> cartService.addItemToCart(user, new AddCartItemRequest(1L, 2)))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("exceeds available stock");

        verify(cartItemRepository, never()).save(any(CartItem.class));
    }
}
