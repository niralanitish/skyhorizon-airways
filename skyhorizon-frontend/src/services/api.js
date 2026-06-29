import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api`,
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
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    return {
      success: true,
      ...response.data,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Invalid credentials";

    throw new Error(
      typeof message === "string" ? message : "Invalid credentials"
    );
  }
};

api.register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });

    if (!response.data) {
      throw new Error("Email is already registered.");
    }

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
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Registration failed";

    throw new Error(
      typeof message === "string"
        ? message
        : "Registration failed"
    );
  }
};

api.askAI = async (message) => {
  try {
    const response = await api.post("/ai/chat", {
      message,
    });

    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Failed to connect AI";

    throw new Error(
      typeof errorMsg === "string"
        ? errorMsg
        : "Failed to connect AI"
    );
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