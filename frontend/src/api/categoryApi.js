import api from "./client";

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await api.post("/categories", payload);
  return data;
};

export const updateCategory = async (categoryId, payload) => {
  const { data } = await api.put(`/categories/${categoryId}`, payload);
  return data;
};

export const deleteCategory = async (categoryId) => {
  await api.delete(`/categories/${categoryId}`);
};
