import api from "./axios";

// Feature 1 — Drug Info Summarizer
export const getDrugSummary = async (productId) => {
  const response = await api.get(`/ai/drug-summary/${productId}`);
  return response.data;
};

// Feature 2 — Natural Language Price Search
export const parseNaturalSearch = async (query) => {
  const response = await api.post("/ai/parse-search", { query });
  return response.data;
};

// Feature 3 — Price Anomaly Check
export const checkPriceAnomaly = async (productId, submittedPrice, city) => {
  const response = await api.post("/ai/check-anomaly", {
    productId,
    submittedPrice,
    city,
  });
  return response.data;
};
