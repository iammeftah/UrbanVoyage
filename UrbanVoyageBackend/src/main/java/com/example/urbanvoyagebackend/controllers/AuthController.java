package com.example.urbanvoyagebackend.controllers;

import com.example.urbanvoyagebackend.dto.LoginRequest;
import com.example.urbanvoyagebackend.dto.VerificationRequest;
import com.example.urbanvoyagebackend.enitity.users.User;
import com.example.urbanvoyagebackend.service.media.EmailService;
import com.example.urbanvoyagebackend.service.users.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User signUpRequest) {
        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = userService.registerUser(signUpRequest);

        // Generate verification code
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        userService.registerUser(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), verificationCode);

        return ResponseEntity.ok("User registered successfully! Please check your email for verification.");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody VerificationRequest verificationRequest) {
        User user = userService.findByEmail(verificationRequest.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found!");
        }

        if (user.getVerificationCode().equals(verificationRequest.getVerificationCode())) {
            user.setVerified(true);
            userService.registerUser(user);
            return ResponseEntity.ok("Email verified successfully!");
        } else {
            return ResponseEntity.badRequest().body("Error: Invalid verification code!");
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found!");
        }

        if (!user.isVerified()) {
            return ResponseEntity.badRequest().body("Error: Email not verified!");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Generate JWT token here if needed
        return ResponseEntity.ok("User signed in successfully!");
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("User signed out successfully!");
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}