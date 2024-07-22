package com.example.urbanvoyagebackend.controllers;

import com.example.urbanvoyagebackend.entity.travel.Reservation;
import com.example.urbanvoyagebackend.models.CheckoutRequest;
import com.example.urbanvoyagebackend.repository.travel.ReservationRepository;
import com.example.urbanvoyagebackend.service.travel.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private PaymentService paymentService;

    public PaymentController(ReservationRepository reservationRepository) {
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody CheckoutRequest checkoutRequest) throws StripeException {
        System.out.println("Received request to create checkout session");
        System.out.println("Product: " + checkoutRequest.getProductName());
        System.out.println("Amount: " + checkoutRequest.getAmount());

        Stripe.apiKey = stripeApiKey;

        SessionCreateParams params = SessionCreateParams.builder()

                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:4200/routes")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("mad")
                                .setUnitAmount((long) (checkoutRequest.getAmount() * 100L))
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(checkoutRequest.getProductName())
                                        .build())
                                .build())
                        .build())
                .setClientReferenceId(checkoutRequest.getReservationId().toString()) // Add this line
                .build();


        Session session = Session.create(params);
        System.out.println("Created session with ID: " + session.getId());
        System.out.println("Session URL: " + session.getUrl());



        Map<String, String> responseData = new HashMap<>();
        responseData.put("id", session.getId());
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<Map<String, String>> confirmPayment(@RequestBody Map<String, String> payload) {
        String sessionId = payload.get("sessionId");
        Map<String, String> response = new HashMap<>();

        try {
            Stripe.apiKey = stripeApiKey;
            Session session = Session.retrieve(sessionId);

            if ("complete".equals(session.getStatus())) {
                String reservationId = session.getClientReferenceId();
                Reservation reservation = reservationRepository.findById(Long.parseLong(reservationId))
                        .orElseThrow(() -> new RuntimeException("Reservation not found"));

                reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
                reservationRepository.save(reservation);

                // Create a payment record
                paymentService.createPayment(reservation, session.getAmountTotal() / 100.0, "COMPLETED");

                response.put("status", "success");
                response.put("message", "Payment confirmed and reservation updated");
            } else {
                response.put("status", "failure");
                response.put("message", "Payment was not successful");
            }

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            response.put("status", "error");
            response.put("message", "Error confirming payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/cancel-payment")
    public ResponseEntity<Map<String, String>> cancelPayment(@RequestBody Map<String, String> payload) {
        String sessionId = payload.get("sessionId");
        Map<String, String> response = new HashMap<>();

        try {
            Stripe.apiKey = stripeApiKey;
            Session session = Session.retrieve(sessionId);

            String reservationId = session.getClientReferenceId();
            Reservation reservation = reservationRepository.findById(Long.parseLong(reservationId))
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));

            reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            reservationRepository.save(reservation);

            response.put("status", "success");
            response.put("message", "Payment cancelled and reservation updated");

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            response.put("status", "error");
            response.put("message", "Error cancelling payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

}