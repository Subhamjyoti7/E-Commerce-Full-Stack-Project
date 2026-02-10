package com.subham.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.subham.entity.User;
import com.subham.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5501") // frontend URL
public class AuthController {

    @Autowired
    private UserRepository repo;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (repo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email already exists"));
        }

        repo.save(user);

        // DO NOT return password
        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail()
                )
        );
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {

        User user = repo.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        // SUCCESS RESPONSE (SAFE)
        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail()
                )
        );
    }
}
