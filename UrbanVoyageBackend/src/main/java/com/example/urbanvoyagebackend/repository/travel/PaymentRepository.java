package com.example.urbanvoyagebackend.repository.travel;

import com.example.urbanvoyagebackend.entity.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
