package com.placement.controller;

import com.placement.dto.AuthRequest;
import com.placement.dto.AuthResponse;
import com.placement.dto.RegisterRequest;
import com.placement.entity.CompanyProfile;
import com.placement.entity.Role;
import com.placement.entity.StudentProfile;
import com.placement.entity.User;
import com.placement.repository.CompanyProfileRepository;
import com.placement.repository.StudentProfileRepository;
import com.placement.repository.UserRepository;
import com.placement.security.CustomUserDetails;
import com.placement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;

    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          StudentProfileRepository studentProfileRepository,
                          CompanyProfileRepository companyProfileRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyProfileRepository = companyProfileRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthenticated"));
        }

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Long profileId = null;
        String identifier = null;

        if (user.getRole() == Role.STUDENT) {
            StudentProfile p = studentProfileRepository.findByUser(user).orElse(null);
            if (p != null) {
                profileId = p.getId();
                identifier = p.getRollNumber();
            }
        } else if (user.getRole() == Role.RECRUITER) {
            CompanyProfile p = companyProfileRepository.findByUser(user).orElse(null);
            if (p != null) {
                profileId = p.getId();
                identifier = p.getCompanyName();
            }
        }

        return ResponseEntity.ok(new AuthResponse(
                null,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                profileId,
                identifier
        ));
    }
}
