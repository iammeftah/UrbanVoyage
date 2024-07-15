package com.example.urbanvoyagebackend.controllers;

import com.example.urbanvoyagebackend.entity.users.User;
import com.example.urbanvoyagebackend.service.users.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}