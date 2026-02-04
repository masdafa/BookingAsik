import api from "./axios";

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

export const getHotels = () => api.get("/hotels");
export const getHotelById = (id) => api.get(`/hotels/${id}`);
export const createHotel = (data) => api.post("/hotels", data);
export const updateHotel = (id, data) => api.put(`/hotels/${id}`, data);
export const deleteHotel = (id) => api.delete(`/hotels/${id}`);
