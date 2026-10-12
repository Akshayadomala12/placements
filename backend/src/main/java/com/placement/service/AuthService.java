package com.placement.service;

import com.placement.dto.AuthRequest;
import com.placement.dto.AuthResponse;
import com.placement.dto.RegisterRequest;
import com.placement.entity.*;
import com.placement.repository.CompanyProfileRepository;
import com.placement.repository.StudentProfileRepository;
import com.placement.repository.UserRepository;
import com.placement.security.CustomUserDetails;
import com.placement.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentProfileRepository studentProfileRepository,
                       CompanyProfileRepository companyProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long profileId = null;
        String profileIdentifier = null;

        if (user.getRole() == Role.STUDENT) {
            StudentProfile profile = studentProfileRepository.findByUser(user).orElse(null);
            if (profile != null) {
                profileId = profile.getId();
                profileIdentifier = profile.getRollNumber();
            }
        } else if (user.getRole() == Role.RECRUITER) {
            CompanyProfile profile = companyProfileRepository.findByUser(user).orElse(null);
            if (profile != null) {
                profileId = profile.getId();
                profileIdentifier = profile.getCompanyName();
            }
        }

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                profileId,
                profileIdentifier
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                request.getPhone()
        );
        user = userRepository.save(user);

        Long profileId = null;
        String profileIdentifier = null;

        if (request.getRole() == Role.STUDENT) {
            if (request.getRollNumber() != null && studentProfileRepository.existsByRollNumber(request.getRollNumber())) {
                throw new IllegalArgumentException("Roll number is already registered: " + request.getRollNumber());
            }

            StudentProfile studentProfile = new StudentProfile();
            studentProfile.setUser(user);
            studentProfile.setRollNumber(request.getRollNumber() != null ? request.getRollNumber() : "TEMP-" + user.getId());
            studentProfile.setDepartment(request.getDepartment() != null ? request.getDepartment() : "Computer Science");
            studentProfile.setBatchYear(request.getBatchYear() != null ? request.getBatchYear() : 2026);
            studentProfile.setCgpa(request.getCgpa() != null ? request.getCgpa() : BigDecimal.valueOf(7.0));
            studentProfile.setActiveBacklogs(request.getActiveBacklogs() != null ? request.getActiveBacklogs() : 0);
            studentProfile.setHistoryBacklogs(request.getHistoryBacklogs() != null ? request.getHistoryBacklogs() : 0);
            studentProfile.setSkills(request.getSkills() != null ? request.getSkills() : "");

            studentProfile = studentProfileRepository.save(studentProfile);
            profileId = studentProfile.getId();
            profileIdentifier = studentProfile.getRollNumber();

        } else if (request.getRole() == Role.RECRUITER) {
            CompanyProfile companyProfile = new CompanyProfile();
            companyProfile.setUser(user);
            companyProfile.setCompanyName(request.getCompanyName() != null ? request.getCompanyName() : user.getName() + " Enterprise");
            companyProfile.setIndustry(request.getIndustry() != null ? request.getIndustry() : "Technology");
            companyProfile.setWebsite(request.getWebsite());
            companyProfile.setLocation(request.getLocation() != null ? request.getLocation() : "Remote");
            companyProfile.setDescription(request.getDescription());
            companyProfile.setIsVerified(true);

            companyProfile = companyProfileRepository.save(companyProfile);
            profileId = companyProfile.getId();
            profileIdentifier = companyProfile.getCompanyName();
        }

        // Authenticate the newly registered user
        return authenticate(new AuthRequest(request.getEmail(), request.getPassword()));
    }
}
