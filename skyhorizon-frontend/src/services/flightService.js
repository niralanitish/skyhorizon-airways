import api from "./api";

// Cosmetic-only mapping for premium brand logos (e.g., mapping to SH, AI, BW, NA, SJ)
export const enrichFlightCosmetics = (flight) => {
  if (!flight) return flight;

  let airlineCode = "SH"; // Default to SkyHorizon logo
  const airlineLower = (flight.airline || "").toLowerCase();
  
  if (airlineLower.includes("indigo") || airlineLower.includes("6e")) {
    airlineCode = "BW";
  } else if (airlineLower.includes("air india") || airlineLower.includes("ai")) {
    airlineCode = "AI";
  } else if (airlineLower.includes("spicejet") || airlineLower.includes("sg")) {
    airlineCode = "SJ";
  } else if (airlineLower.includes("vistara") || airlineLower.includes("na")) {
    airlineCode = "NA";
  }

  return {
    ...flight,
    airlineCode,
  };
};

export const getFlights = async () => {
  const response = await api.get("/flights");
  return (response.data || []).map(enrichFlightCosmetics);
};

export const searchFlights = async (source, destination) => {
  const response = await api.get("/flights/search", {
    params: {
      source,
      destination,
    },
  });

  return (response.data || []).map(enrichFlightCosmetics);
};