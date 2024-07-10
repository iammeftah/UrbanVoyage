package com.example.urbanvoyagebackend.enitity.payment;

import com.example.urbanvoyagebackend.enitity.travel.Reservation;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentID;

    @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private Date paymentDate;

    @Column(nullable = false)
    private String status;

    // Constructors, getters, and setters

    public Payment() {}

    public Payment(Reservation reservation, double amount, Date paymentDate, String status) {
        this.reservation = reservation;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.status = status;
    }

    // Getters and setters for all fields

    public boolean makePayment() {
        // Implement payment logic
        return true;
    }

    public boolean refund() {
        // Implement refund logic
        return true;
    }
}
