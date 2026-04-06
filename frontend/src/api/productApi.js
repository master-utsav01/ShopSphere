import api from "./client";

export const getProducts = async (params) => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const getProductById = async (productId) => {
  const { data } = await api.get(`/products/${productId}`);
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data;
};

export const updateProduct = async (productId, payload) => {
  const { data } = await api.put(`/products/${productId}`, payload);
  return data;
};

export const deleteProduct = async (productId) => {
  await api.delete(`/products/${productId}`);
};
