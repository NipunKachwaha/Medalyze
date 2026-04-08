import api from "./axios";

export const getPrices = async (filters = {}) => {
  // Remove empty filter values before sending
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "" && v !== null),
  );
  const response = await api.get("/prices", { params: cleanFilters });
  return response.data;
};

export const submitPrice = async (data) => {
  const response = await api.post("/prices", data);
  return response.data;
};

export const getPriceHistory = async (productId, locationId) => {
  const response = await api.get(`/prices/${productId}/history`, {
    params: { locationId },
  });
  return response.data;
};

export const getPendingPrices = async () => {
  const response = await api.get("/admin/prices/pending");
  return response.data;
};

export const approvePrice = async (id) => {
  const response = await api.patch(`/admin/prices/${id}/approve`);
  return response.data;
};

export const rejectPrice = async (id) => {
  const response = await api.patch(`/admin/prices/${id}/reject`);
  return response.data;
};
