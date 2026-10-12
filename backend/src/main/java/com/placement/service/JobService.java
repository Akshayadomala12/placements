package com.placement.service;

import com.placement.dto.JobRequest;
import com.placement.dto.JobResponse;
import com.placement.entity.*;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentService studentService;

    public JobService(JobRepository jobRepository,
                      ApplicationRepository applicationRepository,
                      StudentProfileRepository studentProfileRepository,
                      StudentService studentService) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.studentService = studentService;
    }

    @Transactional
    public Job createJob(CompanyProfile company, JobRequest request) {
        Job job = new Job();
        job.setCompany(company);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        job.setSalaryPackage(request.getSalaryPackage());
        job.setMinCgpa(request.getMinCgpa());
        job.setMaxBacklogs(request.getMaxBacklogs() != null ? request.getMaxBacklogs() : 0);
        job.setAllowedDepartments(request.getAllowedDepartments() != null ? request.getAllowedDepartments() : "ALL");
        job.setBatchYear(request.getBatchYear());
        job.setDeadline(request.getDeadline());
        job.setStatus("OPEN");

        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJob(Long jobId, CompanyProfile company, JobRequest request) {
        Job job = getJobById(jobId);
        if (!job.getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        job.setSalaryPackage(request.getSalaryPackage());
        job.setMinCgpa(request.getMinCgpa());
        job.setMaxBacklogs(request.getMaxBacklogs() != null ? request.getMaxBacklogs() : 0);
        job.setAllowedDepartments(request.getAllowedDepartments() != null ? request.getAllowedDepartments() : "ALL");
        job.setBatchYear(request.getBatchYear());
        job.setDeadline(request.getDeadline());

        return jobRepository.save(job);
    }

    @Transactional
    public void toggleJobStatus(Long jobId, CompanyProfile company, String status) {
        Job job = getJobById(jobId);
        if (!job.getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("You are not authorized to change status of this job");
        }
        job.setStatus(status);
        jobRepository.save(job);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + id));
    }

    public List<JobResponse> getAllJobsForPublic() {
        return jobRepository.findByStatusOrderByCreatedAtDesc("OPEN").stream()
                .map(job -> mapToResponse(job, null))
                .toList();
    }

    public List<JobResponse> getAllJobsForStudent(Long studentUserId) {
        StudentProfile student = studentProfileRepository.findByUserId(studentUserId).orElse(null);
        return jobRepository.findByStatusOrderByCreatedAtDesc("OPEN").stream()
                .map(job -> mapToResponse(job, student))
                .toList();
    }

    public List<JobResponse> getJobsByCompany(CompanyProfile company) {
        return jobRepository.findByCompany(company).stream()
                .map(job -> mapToResponse(job, null))
                .toList();
    }

    public JobResponse mapToResponse(Job job, StudentProfile student) {
        JobResponse res = new JobResponse();
        res.setId(job.getId());
        res.setCompanyId(job.getCompany().getId());
        res.setCompanyName(job.getCompany().getCompanyName());
        res.setCompanyLogo(job.getCompany().getLogoUrl());
        res.setCompanyIndustry(job.getCompany().getIndustry());
        res.setCompanyWebsite(job.getCompany().getWebsite());

        res.setTitle(job.getTitle());
        res.setDescription(job.getDescription());
        res.setJobType(job.getJobType());
        res.setLocation(job.getLocation());
        res.setSalaryPackage(job.getSalaryPackage());
        res.setMinCgpa(job.getMinCgpa());
        res.setMaxBacklogs(job.getMaxBacklogs());
        res.setAllowedDepartments(job.getAllowedDepartments());
        res.setBatchYear(job.getBatchYear());
        res.setDeadline(job.getDeadline());
        res.setStatus(job.getStatus());
        res.setCreatedAt(job.getCreatedAt());

        long count = applicationRepository.findByJobId(job.getId()).size();
        res.setApplicantCount(count);

        if (student != null) {
            String reason = studentService.checkEligibilityReason(student, job);
            res.setIsEligible(reason == null);
            res.setEligibilityReason(reason);

            Optional<Application> app = applicationRepository.findByStudentAndJob(student, job);
            res.setHasApplied(app.isPresent());
            app.ifPresent(application -> res.setApplicationStatus(application.getStatus()));
        }

        return res;
    }
}
