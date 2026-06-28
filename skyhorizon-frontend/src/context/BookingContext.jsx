import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import { enrichFlightCosmetics } from '../services/flightService';

const BookingContext = createContext();

export function useBooking() {
  return useContext(BookingContext);
}

// Map backend Booking entity to frontend format cleanly with strict no-fake-data policy
const mapBackendBooking = (booking) => {
  if (!booking) return null;

  // Extract the real booked date from the backend booking number (SHB + timestamp) if possible
  let bookedAt = "—";
  if (booking.bookingNumber && booking.bookingNumber.startsWith("SHB")) {
    const timestampStr = booking.bookingNumber.substring(3);
    const timestamp = parseInt(timestampStr, 10);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);
      bookedAt = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  return {
    id: booking.id,
    bookingId: booking.bookingNumber || `SH-${booking.id}`,
    bookedAt: bookedAt,
    status: booking.bookingStatus === 'CONFIRMED' ? 'Confirmed' : 'Cancelled',
    seat: '—', // Graceful placeholder (business field not provided by backend)
    travellers: booking.numberOfSeats || 1,
    flight: enrichFlightCosmetics(booking.flight),
  };
};

export function BookingProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState({
    from: 'Hyderabad (HYD)',
    to: 'Goa (GOI)',
    departDate: '22 Jun, 2025',
    departDay: 'Sunday',
    travellers: 1,
    flightClass: 'Economy',
    tripType: 'One Way'
  });

  const [selectedFlight, setSelectedFlightState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('skyhorizon_selected_flight');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const setSelectedFlight = (flight) => {
    setSelectedFlightState(flight);
    try {
      if (flight) {
        sessionStorage.setItem('skyhorizon_selected_flight', JSON.stringify(flight));
      } else {
        sessionStorage.removeItem('skyhorizon_selected_flight');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  
  const [passengerDetails, setPassengerDetailsState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('skyhorizon_passenger_details');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const setPassengerDetails = (details) => {
    setPassengerDetailsState(details);
    try {
      if (details) {
        sessionStorage.setItem('skyhorizon_passenger_details', JSON.stringify(details));
      } else {
        sessionStorage.removeItem('skyhorizon_passenger_details');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sync bookings from backend
  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my");
      const mapped = (response.data || []).map(mapBackendBooking);
      setBookings(mapped);
      return mapped;
    } catch (error) {
      console.error("Error fetching bookings from backend:", error);
      setBookings([]);
      return [];
    }
  };

  // Load user from localStorage and sync bookings on init
  useEffect(() => {
    const savedUser = localStorage.getItem('skyhorizon_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchBookings();
    }
  }, []);

  const login = (loginResponse) => {
    // Store only real backend data — no fake avatars or synthetic fields
    const enrichedUser = {
      id: loginResponse.id,
      name: loginResponse.name || loginResponse.email?.split('@')[0]?.replace(/[^a-zA-Z]/g, ' ')?.replace(/\b\w/g, c => c.toUpperCase()) || 'User',
      email: loginResponse.email,
      role: loginResponse.role || 'USER',
      token: loginResponse.token,
    };

    setUser(enrichedUser);
    localStorage.setItem("skyhorizon_user", JSON.stringify(enrichedUser));
    localStorage.setItem("skyhorizon_token", loginResponse.token);
    
    // Fetch bookings immediately after login
    fetchBookings();
  };

  const logout = () => {
    setUser(null);
    setBookings([]);
    localStorage.removeItem("skyhorizon_user");
    localStorage.removeItem("skyhorizon_token");
  };

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      await fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking on backend:", error);
      throw error;
    }
  };

  return (
    <BookingContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedFlight,
        setSelectedFlight,
        user,
        login,
        logout,
        bookings,
        fetchBookings,
        cancelBooking,
        passengerDetails,
        setPassengerDetails
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

BookingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

