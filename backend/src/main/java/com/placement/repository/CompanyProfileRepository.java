package com.placement.repository;

import com.placement.entity.CompanyProfile;
import com.placement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
    Optional<CompanyProfile> findByUser(User user);
    Optional<CompanyProfile> findByUserId(Long userId);
    Optional<CompanyProfile> findByCompanyName(String companyName);
}
