package com.placement.service;

import com.placement.dto.StudentProfileDto;
import com.placement.entity.Job;
import com.placement.entity.StudentProfile;
import com.placement.entity.User;
import com.placement.repository.StudentProfileRepository;
import com.placement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    public StudentService(StudentProfileRepository studentProfileRepository, UserRepository userRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
    }

    public StudentProfile getProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found for user ID: " + userId));
    }

    public StudentProfileDto getProfileDtoByUserId(Long userId) {
        StudentProfile profile = getProfileByUserId(userId);
        return mapToDto(profile);
    }

    public List<StudentProfileDto> getAllStudents() {
        return studentProfileRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public StudentProfileDto updateProfile(Long userId, StudentProfileDto dto) {
        StudentProfile profile = getProfileByUserId(userId);
        User user = profile.getUser();

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getRollNumber() != null) profile.setRollNumber(dto.getRollNumber());
        if (dto.getDepartment() != null) profile.setDepartment(dto.getDepartment());
        if (dto.getBatchYear() != null) profile.setBatchYear(dto.getBatchYear());
        if (dto.getCgpa() != null) profile.setCgpa(dto.getCgpa());
        if (dto.getActiveBacklogs() != null) profile.setActiveBacklogs(dto.getActiveBacklogs());
        if (dto.getHistoryBacklogs() != null) profile.setHistoryBacklogs(dto.getHistoryBacklogs());
        if (dto.getSkills() != null) profile.setSkills(dto.getSkills());
        if (dto.getResumeHeadline() != null) profile.setResumeHeadline(dto.getResumeHeadline());
        if (dto.getGithubUrl() != null) profile.setGithubUrl(dto.getGithubUrl());
        if (dto.getLinkedinUrl() != null) profile.setLinkedinUrl(dto.getLinkedinUrl());

        profile = studentProfileRepository.save(profile);
        return mapToDto(profile);
    }

    public String checkEligibilityReason(StudentProfile student, Job job) {
        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDate.now())) {
            return "Application deadline has passed";
        }
        if (job.getMinCgpa() != null && student.getCgpa().compareTo(job.getMinCgpa()) < 0) {
            return "CGPA (" + student.getCgpa() + ") is lower than requirement (" + job.getMinCgpa() + ")";
        }
        if (job.getMaxBacklogs() != null && student.getActiveBacklogs() > job.getMaxBacklogs()) {
            return "Active backlogs (" + student.getActiveBacklogs() + ") exceeds maximum allowed (" + job.getMaxBacklogs() + ")";
        }
        if (job.getBatchYear() != null && !job.getBatchYear().equals(student.getBatchYear())) {
            return "Target batch year is " + job.getBatchYear() + " (your batch: " + student.getBatchYear() + ")";
        }
        if (job.getAllowedDepartments() != null && !job.getAllowedDepartments().equalsIgnoreCase("ALL")) {
            List<String> allowed = Arrays.stream(job.getAllowedDepartments().split(","))
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .toList();
            if (!allowed.contains(student.getDepartment().trim().toLowerCase())) {
                return "Department (" + student.getDepartment() + ") not eligible for this role";
            }
        }
        return null; // Eligible!
    }

    public StudentProfileDto mapToDto(StudentProfile profile) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhone(profile.getUser().getPhone());
        dto.setRollNumber(profile.getRollNumber());
        dto.setDepartment(profile.getDepartment());
        dto.setBatchYear(profile.getBatchYear());
        dto.setCgpa(profile.getCgpa());
        dto.setActiveBacklogs(profile.getActiveBacklogs());
        dto.setHistoryBacklogs(profile.getHistoryBacklogs());
        dto.setSkills(profile.getSkills());
        dto.setResumeHeadline(profile.getResumeHeadline());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        return dto;
    }
}
