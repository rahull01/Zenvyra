package com.complianceai.service;

import com.complianceai.model.Banner;
import com.complianceai.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public Banner createBanner(String organizationId, Banner banner) {
        banner.setOrganizationId(organizationId);
        banner.setId(UUID.randomUUID().toString());
        banner.setStatus("draft");
        banner.setCreatedAt(LocalDateTime.now());
        banner.setUpdatedAt(LocalDateTime.now());
        
        // Generate initial embed code
        banner.setEmbedCode(generateEmbedCode(banner.getId()));
        
        return bannerRepository.save(banner);
    }

    public List<Banner> getBannersByOrganization(String organizationId) {
        return bannerRepository.findByOrganizationId(organizationId);
    }

    public Banner getBannerById(String id) {
        return bannerRepository.findById(id).orElseThrow(() -> new RuntimeException("Banner not found"));
    }

    public Banner updateBanner(String id, Banner bannerUpdate) {
        Banner banner = getBannerById(id);
        banner.setName(bannerUpdate.getName());
        banner.setPosition(bannerUpdate.getPosition());
        banner.setLayout(bannerUpdate.getLayout());
        banner.setColors(bannerUpdate.getColors());
        banner.setContent(bannerUpdate.getContent());
        banner.setCategories(bannerUpdate.getCategories());
        banner.setLanguages(bannerUpdate.getLanguages());
        banner.setRegionalRules(bannerUpdate.getRegionalRules());
        banner.setAdvanced(bannerUpdate.getAdvanced());
        banner.setStatus(bannerUpdate.getStatus());
        banner.setUpdatedAt(LocalDateTime.now());
        return bannerRepository.save(banner);
    }

    public void deleteBanner(String id) {
        bannerRepository.deleteById(id);
    }

    private String generateEmbedCode(String bannerId) {
        return String.format(
            "<script src=\"https://cdn.complianceai.pro/v1/banner.js\" data-id=\"%s\" async></script>",
            bannerId
        );
    }
}
