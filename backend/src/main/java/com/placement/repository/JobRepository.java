package com.placement.repository;

import com.placement.entity.CompanyProfile;
import com.placement.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(String status);
    List<Job> findByCompany(CompanyProfile company);
    List<Job> findByCompanyId(Long companyId);
    List<Job> findByStatusOrderByCreatedAtDesc(String status);
}
