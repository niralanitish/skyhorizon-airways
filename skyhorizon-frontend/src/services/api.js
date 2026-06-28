import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("skyhorizon_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Authentication endpoints
api.login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:8080/login", { email, password });
    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message || "Invalid credentials";
    throw new Error(typeof message === "string" ? message : "Invalid credentials");
  }
};

api.register = async (name, email, password) => {
  try {
    const response = await axios.post("http://localhost:8080/register", { name, email, password });
    
    // The backend returns null if the email is already registered
    if (!response.data) {
      throw new Error("Email is already registered. Please log in.");
    }
    
    // Auto-login the user to retrieve the JWT token
    const loginData = await api.login(email, password);
    
    return {
      success: true,
      user: {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        token: loginData.token,
      },
    };
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data || error.message || "Registration failed";
    throw new Error(typeof message === "string" ? message : "Registration failed");
  }
};

export const airportCodes = {
  Hyderabad: "HYD",
  Delhi: "DEL",
  Mumbai: "BOM",
  Bangalore: "BLR",
  Chennai: "MAA",
  Kolkata: "CCU",
  Pune: "PNQ",
  Goa: "GOI",
  Ahmedabad: "AMD",
  Jaipur: "JAI",
  Kochi: "COK",
  Lucknow: "LKO",
};

export default api;