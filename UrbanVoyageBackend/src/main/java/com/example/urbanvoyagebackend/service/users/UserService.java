// UserService.java
package com.example.urbanvoyagebackend.service.users;

import com.example.urbanvoyagebackend.config.UsernameGenerator;
import com.example.urbanvoyagebackend.dto.UserDTO;
import com.example.urbanvoyagebackend.enitity.users.Client;
import com.example.urbanvoyagebackend.enitity.users.User;
import com.example.urbanvoyagebackend.repository.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

import static com.example.urbanvoyagebackend.config.UsernameGenerator.generateUniqueUsername;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, UserDTO> unverifiedUsers = new HashMap<>();

    public User registerUser(UserDTO userDTO) {
        Client client = new Client(
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getPhoneNumber(),
                userDTO.getEmail(),
                userDTO.getUsername(),
                passwordEncoder.encode(userDTO.getPassword())
        );
        if(client.getUsername() == null || client.getUsername().isEmpty()){
            client.setUsername(generateUniqueUsername(userDTO.getFirstName(), userDTO.getLastName()));
        }
        return userRepository.save(client);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public void storeUnverifiedUser(UserDTO userDTO, String verificationCode) {
        userDTO.setVerificationCode(verificationCode);
        unverifiedUsers.put(userDTO.getEmail(), userDTO);
    }

    public UserDTO getUnverifiedUser(String email) {
        return unverifiedUsers.get(email);
    }

    public User registerVerifiedUser(UserDTO userDTO) {
        Client client = new Client();
        client.setFirstName(userDTO.getFirstName());
        client.setLastName(userDTO.getLastName());
        client.setPhoneNumber(userDTO.getPhoneNumber());
        client.setEmail(userDTO.getEmail());
        client.setUsername(userDTO.getUsername());

        // If username is still null or empty, generate one
        if(client.getUsername() == null || client.getUsername().isEmpty()){
            client.setUsername(generateUniqueUsername(userDTO.getFirstName(), userDTO.getLastName()));
        }

        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
        client.setPassword(hashedPassword);

        client.setVerified(true);

        User savedUser = userRepository.save(client);
        unverifiedUsers.remove(userDTO.getEmail());
        return savedUser;
    }
}