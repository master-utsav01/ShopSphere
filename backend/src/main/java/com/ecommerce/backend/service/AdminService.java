package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.admin.AdminCreateRequest;
import com.ecommerce.backend.dto.admin.AdminDashboardSummaryResponse;
import com.ecommerce.backend.dto.admin.AdminOrderResponse;
import com.ecommerce.backend.dto.admin.AdminOrderStatusUpdateRequest;
import com.ecommerce.backend.dto.admin.AdminUserResponse;
import com.ecommerce.backend.dto.common.PageResponse;

public interface AdminService {

    AdminDashboardSummaryResponse getDashboardSummary();

    PageResponse<AdminOrderResponse> getOrders(int page, int size);

    AdminOrderResponse updateOrderStatus(Long orderId, AdminOrderStatusUpdateRequest request);

    PageResponse<AdminUserResponse> getUsers(int page, int size);

    AdminUserResponse createAdmin(AdminCreateRequest request);
}
