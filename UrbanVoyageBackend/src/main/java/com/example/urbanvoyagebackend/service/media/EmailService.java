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

    public void sendVerificationEmail(String to, String verificationCode) throws IOException {
        String url = "https://send.api.mailtrap.io/api/send";

        Map<String, Object> emailData = new HashMap<>();
        emailData.put("from", Map.of("email", "noreply@yourapp.com", "name", "Your App"));
        emailData.put("to", new Object[]{Map.of("email", to)});
        emailData.put("subject", "Email Verification");
        emailData.put("text", "Your verification code is: " + verificationCode);
        emailData.put("category", "Verification");

        RequestBody body = RequestBody.create(
            objectMapper.writeValueAsString(emailData),
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(url)
            .post(body)
            .addHeader("Authorization", "Bearer " + mailtrapToken)
            .addHeader("Content-Type", "application/json")
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            // You can log the response or handle it as needed
            System.out.println(response.body().string());
        }
    }
}