package com.placement.service;

import com.placement.dto.ApplicationStatusUpdate;
import com.placement.entity.*;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentService studentService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              StudentProfileRepository studentProfileRepository,
                              StudentService studentService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.studentService = studentService;
    }

    @Transactional
    public Application applyToJob(Long studentUserId, Long jobId) {
        StudentProfile student = studentProfileRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for user ID: " + studentUserId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));

        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw new IllegalStateException("This job is no longer accepting applications");
        }

        if (applicationRepository.existsByStudentAndJob(student, job)) {
            throw new IllegalStateException("You have already applied to this job");
        }

        String eligibilityError = studentService.checkEligibilityReason(student, job);
        if (eligibilityError != null) {
            throw new IllegalStateException("Not eligible to apply: " + eligibilityError);
        }

        Application application = new Application(job, student);
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByStudent(Long studentUserId) {
        StudentProfile student = studentProfileRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        return applicationRepository.findByStudent(student);
    }

    public List<Application> getApplicationsByCompany(CompanyProfile company) {
        return applicationRepository.findByJobCompanyId(company.getId());
    }

    public List<Application> getApplicationsByJob(Long jobId, CompanyProfile company) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!job.getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("You are not authorized to view applications for this job");
        }

        return applicationRepository.findByJob(job);
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, CompanyProfile company, ApplicationStatusUpdate update) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + applicationId));

        if (!application.getJob().getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("Unauthorized to modify this application");
        }

        application.setStatus(update.getStatus());
        if (update.getFeedback() != null) {
            application.setFeedback(update.getFeedback());
        }
        application.setUpdatedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    @Transactional
    public void withdrawApplication(Long studentUserId, Long applicationId) {
        StudentProfile student = studentProfileRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (!app.getStudent().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Unauthorized to withdraw this application");
        }

        applicationRepository.delete(app);
    }
}
