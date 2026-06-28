import api from "./api";

export const getFlights = async () => {
    const response = await api.get("/flights");
    return response.data;
};

export const searchFlights = async (source, destination) => {
    const response = await api.get("/flights/search", {
        params: {
            source,
            destination,
        },
    });

    return response.data;
};