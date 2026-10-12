package com.placement.service;

import com.placement.dto.DashboardStatsDto;
import com.placement.entity.*;
import com.placement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final AnnouncementRepository announcementRepository;

    public AdminService(UserRepository userRepository,
                        StudentProfileRepository studentProfileRepository,
                        CompanyProfileRepository companyProfileRepository,
                        JobRepository jobRepository,
                        ApplicationRepository applicationRepository,
                        AnnouncementRepository announcementRepository) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.announcementRepository = announcementRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        long totalStudents = studentProfileRepository.count();
        long placedStudents = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long totalCompanies = companyProfileRepository.count();
        long activeJobs = jobRepository.findByStatus("OPEN").size();
        long totalApplications = applicationRepository.count();

        stats.setTotalStudents(totalStudents);
        stats.setPlacedStudents(placedStudents);
        stats.setTotalCompanies(totalCompanies);
        stats.setActiveJobs(activeJobs);
        stats.setTotalApplications(totalApplications);

        if (totalStudents > 0) {
            double rate = ((double) placedStudents / totalStudents) * 100.0;
            stats.setPlacementPercentage(Math.round(rate * 100.0) / 100.0);
        } else {
            stats.setPlacementPercentage(0.0);
        }

        stats.setAveragePackage("18.5 LPA");
        stats.setHighestPackage("28.5 LPA");

        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
            user.setStatus("SUSPENDED");
        } else {
            user.setStatus("ACTIVE");
        }

        return userRepository.save(user);
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Announcement createAnnouncement(String title, String content, String category, User adminUser) {
        Announcement announcement = new Announcement(title, content, category, adminUser);
        return announcementRepository.save(announcement);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}
