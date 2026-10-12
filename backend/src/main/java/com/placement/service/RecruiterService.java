package com.placement.service;

import com.placement.dto.CompanyProfileDto;
import com.placement.entity.CompanyProfile;
import com.placement.entity.User;
import com.placement.repository.CompanyProfileRepository;
import com.placement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecruiterService {

    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;

    public RecruiterService(CompanyProfileRepository companyProfileRepository, UserRepository userRepository) {
        this.companyProfileRepository = companyProfileRepository;
        this.userRepository = userRepository;
    }

    public CompanyProfile getProfileByUserId(Long userId) {
        return companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Company profile not found for user ID: " + userId));
    }

    public CompanyProfileDto getProfileDtoByUserId(Long userId) {
        return mapToDto(getProfileByUserId(userId));
    }

    public List<CompanyProfileDto> getAllCompanies() {
        return companyProfileRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public CompanyProfileDto updateProfile(Long userId, CompanyProfileDto dto) {
        CompanyProfile profile = getProfileByUserId(userId);
        User user = profile.getUser();

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        if (dto.getCompanyName() != null) profile.setCompanyName(dto.getCompanyName());
        if (dto.getIndustry() != null) profile.setIndustry(dto.getIndustry());
        if (dto.getWebsite() != null) profile.setWebsite(dto.getWebsite());
        if (dto.getLocation() != null) profile.setLocation(dto.getLocation());
        if (dto.getDescription() != null) profile.setDescription(dto.getDescription());
        if (dto.getLogoUrl() != null) profile.setLogoUrl(dto.getLogoUrl());

        profile = companyProfileRepository.save(profile);
        return mapToDto(profile);
    }

    public CompanyProfileDto mapToDto(CompanyProfile profile) {
        CompanyProfileDto dto = new CompanyProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setName(profile.getUser().getName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhone(profile.getUser().getPhone());
        dto.setCompanyName(profile.getCompanyName());
        dto.setIndustry(profile.getIndustry());
        dto.setWebsite(profile.getWebsite());
        dto.setLocation(profile.getLocation());
        dto.setDescription(profile.getDescription());
        dto.setLogoUrl(profile.getLogoUrl());
        dto.setIsVerified(profile.getIsVerified());
        return dto;
    }
}
