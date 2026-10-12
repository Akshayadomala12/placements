package com.placement.controller;

import com.placement.dto.ApplicationRequest;
import com.placement.dto.JobResponse;
import com.placement.dto.StudentProfileDto;
import com.placement.entity.Application;
import com.placement.security.CustomUserDetails;
import com.placement.service.ApplicationService;
import com.placement.service.JobService;
import com.placement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final StudentService studentService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    public StudentController(StudentService studentService,
                             JobService jobService,
                             ApplicationService applicationService) {
        this.studentService = studentService;
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDto> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        StudentProfileDto profile = studentService.getProfileDtoByUserId(userDetails.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfileDto> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                          @RequestBody StudentProfileDto dto) {
        StudentProfileDto updated = studentService.updateProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getJobsForStudent(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<JobResponse> jobs = jobService.getAllJobsForStudent(userDetails.getId());
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getMyApplications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Application> applications = applicationService.getApplicationsByStudent(userDetails.getId());
        return ResponseEntity.ok(applications);
    }

    @PostMapping("/applications")
    public ResponseEntity<?> applyToJob(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @Valid @RequestBody ApplicationRequest request) {
        try {
            Application app = applicationService.applyToJob(userDetails.getId(), request.getJobId());
            return ResponseEntity.ok(app);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> withdrawApplication(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                 @PathVariable Long id) {
        try {
            applicationService.withdrawApplication(userDetails.getId(), id);
            return ResponseEntity.ok(Map.of("message", "Application successfully withdrawn"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
