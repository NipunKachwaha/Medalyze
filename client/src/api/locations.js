import api from "./axios";

export const getLocations = async () => {
  const response = await api.get("/locations");
  return response.data;
};

export const createLocation = async (data) => {
  const response = await api.post("/locations", data);
  return response.data;
};
