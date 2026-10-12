package com.placement.controller;

import com.placement.dto.ApplicationStatusUpdate;
import com.placement.dto.CompanyProfileDto;
import com.placement.dto.JobRequest;
import com.placement.dto.JobResponse;
import com.placement.entity.Application;
import com.placement.entity.CompanyProfile;
import com.placement.entity.Job;
import com.placement.security.CustomUserDetails;
import com.placement.service.ApplicationService;
import com.placement.service.JobService;
import com.placement.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    public RecruiterController(RecruiterService recruiterService,
                               JobService jobService,
                               ApplicationService applicationService) {
        this.recruiterService = recruiterService;
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/profile")
    public ResponseEntity<CompanyProfileDto> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CompanyProfileDto dto = recruiterService.getProfileDtoByUserId(userDetails.getId());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    public ResponseEntity<CompanyProfileDto> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                          @RequestBody CompanyProfileDto dto) {
        CompanyProfileDto updated = recruiterService.updateProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getMyJobs(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CompanyProfile company = recruiterService.getProfileByUserId(userDetails.getId());
        List<JobResponse> jobs = jobService.getJobsByCompany(company);
        return ResponseEntity.ok(jobs);
    }

    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @Valid @RequestBody JobRequest request) {
        try {
            CompanyProfile company = recruiterService.getProfileByUserId(userDetails.getId());
            Job created = jobService.createJob(company, request);
            return ResponseEntity.ok(jobService.mapToResponse(created, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<?> updateJob(@AuthenticationPrincipal CustomUserDetails userDetails,
                                       @PathVariable Long id,
                                       @Valid @RequestBody JobRequest request) {
        try {
            CompanyProfile company = recruiterService.getProfileByUserId(userDetails.getId());
            Job updated = jobService.updateJob(id, company, request);
            return ResponseEntity.ok(jobService.mapToResponse(updated, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<?> toggleJobStatus(@AuthenticationPrincipal CustomUserDetails userDetails,
                                             @PathVariable Long id,
                                             @RequestParam String status) {
        try {
            CompanyProfile company = recruiterService.getProfileByUserId(userDetails.getId());
            jobService.toggleJobStatus(id, company, status);
            return ResponseEntity.ok(Map.of("message", "Job status updated to " + status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CompanyProfile company = recruiterService.getProfileByUserId(userDetails.getId());
        List<Application> apps = applicationService.getApplicationsByCompany(company);
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/jobs/{id}/applications")
    public ResponseEntity<?> getApplicationsByJob(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                  @PathVariable Long id) {
        try {
            CompanyProfile company = recruiterService.getProfileByUserId(userDetails.getId());
            List<Application> apps = applicationService.getApplicationsByJob(id, company);
            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @PathVariable Long id,
                                                     @Valid @RequestBody ApplicationStatusUpdate update) {
        try {
            CompanyProfile company = recruiterService.getProfileByUserId(userDetails.getId());
            Application app = applicationService.updateApplicationStatus(id, company, update);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
