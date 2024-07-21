package com.example.urbanvoyagebackend.controllers;

import com.example.urbanvoyagebackend.entity.travel.Reservation;
import com.example.urbanvoyagebackend.models.CheckoutRequest;
import com.example.urbanvoyagebackend.repository.travel.ReservationRepository;
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
                .setSuccessUrl("http://localhost:4200/success")
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
                .build();


        Session session = Session.create(params);
        System.out.println("Created session with ID: " + session.getId());
        System.out.println("Session URL: " + session.getUrl());



        Map<String, String> responseData = new HashMap<>();
        responseData.put("id", session.getId());
        return ResponseEntity.ok(responseData);
    }
}