package com.example.urbanvoyagebackend.dto;

public class LoginResponse {
    private  Long id ;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String username;
    private String password;
    private String token; // JWT token

    // Other fields as needed

    public LoginResponse(Long id, String lastName, String firstName, String email, String phoneNumber, String username, String password, String token) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.password = password;
        this.token = token;

    }


    // Constructors, getters, and setters
}