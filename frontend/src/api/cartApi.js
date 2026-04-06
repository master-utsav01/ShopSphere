import api from "./client";

export const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const addToCart = async (payload) => {
  const { data } = await api.post("/cart/items", payload);
  return data;
};

export const updateCartItem = async (itemId, payload) => {
  const { data } = await api.put(`/cart/items/${itemId}`, payload);
  return data;
};

export const removeCartItem = async (itemId) => {
  const { data } = await api.delete(`/cart/items/${itemId}`);
  return data;
};
