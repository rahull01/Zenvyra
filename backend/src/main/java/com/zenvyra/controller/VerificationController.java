package com.zenvyra.controller;

import com.zenvyra.dto.response.PublicVerificationResponse;
import com.zenvyra.service.BadgeImageService;
import com.zenvyra.service.PublicVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
public class VerificationController {

    private final PublicVerificationService publicVerificationService;
    private final BadgeImageService badgeImageService;

    @GetMapping("/verify/{siteId}")
    public ResponseEntity<PublicVerificationResponse> getVerify(@PathVariable String siteId) {
        return ResponseEntity.ok(publicVerificationService.getPublicVerification(siteId));
    }

    @GetMapping(value = "/badge/{siteId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getBadge(@PathVariable String siteId) {
        PublicVerificationResponse payload = publicVerificationService.getPublicVerification(siteId);

        boolean premium = publicVerificationService.isPremiumProxy(siteId);
        BadgeImageService.BadgeState state = badgeImageService.fromScore(payload.getComplianceScore());

        byte[] png = badgeImageService.renderBadgePng(
                payload.getWebsiteName(),
                payload.getComplianceScore(),
                state,
                premium
        );

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(2)).cachePublic())
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                .body(png);
    }
}

