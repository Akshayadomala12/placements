package com.placement.repository;

import com.placement.entity.Application;
import com.placement.entity.ApplicationStatus;
import com.placement.entity.Job;
import com.placement.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(StudentProfile student);
    List<Application> findByStudentId(Long studentId);
    List<Application> findByJob(Job job);
    List<Application> findByJobId(Long jobId);
    List<Application> findByJobCompanyId(Long companyId);
    Optional<Application> findByStudentAndJob(StudentProfile student, Job job);
    boolean existsByStudentAndJob(StudentProfile student, Job job);
    long countByStatus(ApplicationStatus status);
}
