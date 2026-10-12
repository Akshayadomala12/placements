package com.placement.controller;

import com.placement.dto.CompanyProfileDto;
import com.placement.dto.DashboardStatsDto;
import com.placement.dto.StudentProfileDto;
import com.placement.entity.Announcement;
import com.placement.entity.User;
import com.placement.repository.UserRepository;
import com.placement.security.CustomUserDetails;
import com.placement.service.AdminService;
import com.placement.service.RecruiterService;
import com.placement.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final StudentService studentService;
    private final RecruiterService recruiterService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService,
                           StudentService studentService,
                           RecruiterService recruiterService,
                           UserRepository userRepository) {
        this.adminService = adminService;
        this.studentService = studentService;
        this.recruiterService = recruiterService;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            User updated = adminService.toggleUserStatus(id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentProfileDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<CompanyProfileDto>> getAllCompanies() {
        return ResponseEntity.ok(recruiterService.getAllCompanies());
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> createAnnouncement(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                @RequestBody Map<String, String> body) {
        try {
            User admin = userRepository.findById(userDetails.getId()).orElse(null);
            String title = body.get("title");
            String content = body.get("content");
            String category = body.getOrDefault("category", "GENERAL");

            Announcement created = adminService.createAnnouncement(title, content, category, admin);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            adminService.deleteAnnouncement(id);
            return ResponseEntity.ok(Map.of("message", "Announcement deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
