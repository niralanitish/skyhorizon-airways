package com.skyhorizon.skyhorizon_airways.model;

import jakarta.persistence.*;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bookingNumber;

    private String passengerName;

    private int numberOfSeats;

    private Double totalAmount;

    private String bookingStatus;

    private String paymentStatus;

    private String passengerEmail;

private String passengerPhone;

private Integer passengerAge;

private String passengerGender;

private String travelClass;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

    public Booking() {
    }

    public Long getId() {
        return id;
    }

    public String getBookingNumber() {
        return bookingNumber;
    }

    public void setBookingNumber(String bookingNumber) {
        this.bookingNumber = bookingNumber;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(int numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public String getPassengerEmail() {
    return passengerEmail;
}

public void setPassengerEmail(String passengerEmail) {
    this.passengerEmail = passengerEmail;
}

public String getPassengerPhone() {
    return passengerPhone;
}

public void setPassengerPhone(String passengerPhone) {
    this.passengerPhone = passengerPhone;
}

public Integer getPassengerAge() {
    return passengerAge;
}

public void setPassengerAge(Integer passengerAge) {
    this.passengerAge = passengerAge;
}

public String getPassengerGender() {
    return passengerGender;
}

public void setPassengerGender(String passengerGender) {
    this.passengerGender = passengerGender;
}

public String getTravelClass() {
    return travelClass;
}

public void setTravelClass(String travelClass) {
    this.travelClass = travelClass;
}
}