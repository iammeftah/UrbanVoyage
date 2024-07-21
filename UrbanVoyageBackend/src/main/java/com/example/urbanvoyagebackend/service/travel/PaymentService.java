package com.example.urbanvoyagebackend.service.travel;

import com.example.urbanvoyagebackend.entity.payment.Payment;
import com.example.urbanvoyagebackend.entity.travel.Reservation;
import com.example.urbanvoyagebackend.repository.travel.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment createPayment(Reservation reservation, double amount, String status) {
        Payment payment = new Payment(reservation, amount, new Date(), status);
        return paymentRepository.save(payment);
    }
}
