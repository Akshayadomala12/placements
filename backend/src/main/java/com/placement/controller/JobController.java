package com.placement.controller;

import com.placement.dto.JobResponse;
import com.placement.entity.Job;
import com.placement.entity.Role;
import com.placement.entity.StudentProfile;
import com.placement.repository.StudentProfileRepository;
import com.placement.security.CustomUserDetails;
import com.placement.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final StudentProfileRepository studentProfileRepository;

    public JobController(JobService jobService, StudentProfileRepository studentProfileRepository) {
        this.jobService = jobService;
        this.studentProfileRepository = studentProfileRepository;
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails != null && userDetails.getRole() == Role.STUDENT) {
            return ResponseEntity.ok(jobService.getAllJobsForStudent(userDetails.getId()));
        }
        return ResponseEntity.ok(jobService.getAllJobsForPublic());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        Job job = jobService.getJobById(id);
        StudentProfile student = null;
        if (userDetails != null && userDetails.getRole() == Role.STUDENT) {
            student = studentProfileRepository.findByUserId(userDetails.getId()).orElse(null);
        }
        return ResponseEntity.ok(jobService.mapToResponse(job, student));
    }
}
