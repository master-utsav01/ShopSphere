import api from "./client";

export const getAdminSummary = async () => {
  const { data } = await api.get("/admin/dashboard/summary");
  return data;
};

export const getAdminUsers = async (params) => {
  const { data } = await api.get("/admin/users", { params });
  return data;
};

export const createAdminUser = async (payload) => {
  const { data } = await api.post("/admin/users/admins", payload);
  return data;
};

export const getAdminOrders = async (params) => {
  const { data } = await api.get("/admin/orders", { params });
  return data;
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const { data } = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return data;
};
