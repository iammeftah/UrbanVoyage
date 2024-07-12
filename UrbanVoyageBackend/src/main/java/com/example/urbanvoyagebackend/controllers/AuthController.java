package com.example.urbanvoyagebackend.controllers;

import com.example.urbanvoyagebackend.dto.LoginRequest;
import com.example.urbanvoyagebackend.dto.UserDTO;
import com.example.urbanvoyagebackend.dto.VerificationRequest;
import com.example.urbanvoyagebackend.enitity.users.User;
import com.example.urbanvoyagebackend.service.media.EmailService;
import com.example.urbanvoyagebackend.service.users.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final EmailService emailService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        if (userService.existsByUsername(userDTO.getUsername())) {
            return ResponseEntity.badRequest().body(createResponse("Error", "Username is already taken!"));
        }

        if (userService.existsByEmail(userDTO.getEmail())) {
            return ResponseEntity.badRequest().body(createResponse("Error", "Email is already in use!"));
        }

        String verificationCode = generateVerificationCode();
        System.out.println("Generated verification code: " + verificationCode); // Console output

        // Send verification email
        try {
            emailService.sendEmail(userDTO.getEmail(), verificationCode);
            System.out.println("Verification email sent to: " + userDTO.getEmail()); // Console output
        } catch (IOException e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse("Error", "Failed to send verification email"));
        }

        // Store the unverified user details temporarily (you might want to use a cache or temporary storage)
        userService.storeUnverifiedUser(userDTO, verificationCode);

        return ResponseEntity.ok(createResponse("Success", "Verification code sent. Please check your email and verify your account."));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody VerificationRequest verificationRequest) {
        UserDTO unverifiedUser = userService.getUnverifiedUser(verificationRequest.getEmail());
        if (unverifiedUser == null) {
            return ResponseEntity.badRequest().body(createResponse("Error", "No pending verification for this email!"));
        }

        if (unverifiedUser.getVerificationCode().equals(verificationRequest.getVerificationCode())) {
            // Register the user in the database
            User user = userService.registerVerifiedUser(unverifiedUser);
            return ResponseEntity.ok(createResponse("Success", "Email verified successfully! Your account is now active."));
        } else {
            return ResponseEntity.badRequest().body(createResponse("Error", "Invalid verification code!"));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        User user = userService.findByEmail(loginRequest.getEmail());
        if (user == null) {
            return ResponseEntity.badRequest().body(createResponse("Error", "User not found!"));
        }

        if (!user.isVerified()) {
            return ResponseEntity.badRequest().body(createResponse("Error", "Email not verified!"));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Generate JWT token here if needed
            return ResponseEntity.ok(createResponse("Success", "User signed in successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse("Error", "Invalid credentials!"));
        }
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(createResponse("Success", "User signed out successfully!"));
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    private Map<String, String> createResponse(String status, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("status", status);
        response.put("message", message);
        return response;
    }
}