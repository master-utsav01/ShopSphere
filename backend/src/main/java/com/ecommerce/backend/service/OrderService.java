package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.common.PageResponse;
import com.ecommerce.backend.dto.order.OrderResponse;
import com.ecommerce.backend.dto.order.PlaceOrderRequest;
import com.ecommerce.backend.entity.User;

public interface OrderService {

    OrderResponse placeOrder(User user, PlaceOrderRequest request);

    PageResponse<OrderResponse> getOrderHistory(User user, int page, int size);
}
