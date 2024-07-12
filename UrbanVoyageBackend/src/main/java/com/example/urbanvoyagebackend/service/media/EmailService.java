package com.example.urbanvoyagebackend.service.media;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${mailtrap.api.token}")
    private String mailtrapToken;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendEmail(String to, String verificationCode) throws IOException {
        String url = "https://api.mailtrap.io/v1/send";

        Map<String, Object> emailData = new HashMap<>();
        emailData.put("from", Map.of("email", "noreply@urbanvoyage.com", "name", "Urban Voyage"));
        emailData.put("to", new Object[]{Map.of("email", to)});
        emailData.put("subject", "Email Verification");
        emailData.put("text", "Your verification code is: " + verificationCode);
        emailData.put("category", "Verification");

        String jsonBody = objectMapper.writeValueAsString(emailData);
        RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Authorization", "Bearer " + mailtrapToken)
                .addHeader("Content-Type", "application/json")
                .build();

        System.out.println("Sending request to URL: " + url);
        System.out.println("Request headers: " + request.headers());
        System.out.println("Request body: " + jsonBody);

        System.out.println("Sending email to: " + to);
        System.out.println("Using Mailtrap token: " + (mailtrapToken != null ? mailtrapToken.substring(0, Math.min(5, mailtrapToken.length())) + "..." : "null"));

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error body";
                System.err.println("Error sending email. Status code: " + response.code());
                System.err.println("Error response body: " + errorBody);
                System.err.println("Response headers: " + response.headers());
                throw new IOException("Failed to send email. Status code: " + response.code());
            }
            String responseBody = response.body() != null ? response.body().string() : "No response body";
            System.out.println("Email sent successfully. Response: " + responseBody);
        } catch (IOException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Email sending failed", e);
        }
    }

    // You might want to add a method to validate the email address
    private boolean isValidEmail(String email) {
        // Simple regex for email validation
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return email.matches(emailRegex);
    }
}