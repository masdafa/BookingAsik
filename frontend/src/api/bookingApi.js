import api from "./axios";

export const getBookings = () => api.get("/bookings");
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post("/bookings", data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
