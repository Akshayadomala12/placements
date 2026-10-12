package com.placement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "roll_number", nullable = false, unique = true, length = 50)
    private String rollNumber;

    @Column(nullable = false, length = 80)
    private String department;

    @Column(name = "batch_year", nullable = false)
    private Integer batchYear;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "active_backlogs")
    private Integer activeBacklogs = 0;

    @Column(name = "history_backlogs")
    private Integer historyBacklogs = 0;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "resume_headline", length = 255)
    private String resumeHeadline;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    public StudentProfile() {
    }

    public StudentProfile(User user, String rollNumber, String department, Integer batchYear, BigDecimal cgpa) {
        this.user = user;
        this.rollNumber = rollNumber;
        this.department = department;
        this.batchYear = batchYear;
        this.cgpa = cgpa;
        this.activeBacklogs = 0;
        this.historyBacklogs = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getBatchYear() {
        return batchYear;
    }

    public void setBatchYear(Integer batchYear) {
        this.batchYear = batchYear;
    }

    public BigDecimal getCgpa() {
        return cgpa;
    }

    public void setCgpa(BigDecimal cgpa) {
        this.cgpa = cgpa;
    }

    public Integer getActiveBacklogs() {
        return activeBacklogs;
    }

    public void setActiveBacklogs(Integer activeBacklogs) {
        this.activeBacklogs = activeBacklogs;
    }

    public Integer getHistoryBacklogs() {
        return historyBacklogs;
    }

    public void setHistoryBacklogs(Integer historyBacklogs) {
        this.historyBacklogs = historyBacklogs;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResumeHeadline() {
        return resumeHeadline;
    }

    public void setResumeHeadline(String resumeHeadline) {
        this.resumeHeadline = resumeHeadline;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }
}
