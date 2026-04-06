import api from "./client";

export const placeOrder = async (payload) => {
  const { data } = await api.post("/orders", payload);
  return data;
};

export const getOrderHistory = async (params) => {
  const { data } = await api.get("/orders/me", { params });
  return data;
};
