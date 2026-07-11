package com.zenvyra.controller;

import com.zenvyra.dto.response.AiActPublicVerificationResponse;
import com.zenvyra.service.AiActCertificateService;
import com.zenvyra.service.BadgeImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
public class AiActVerificationController {

    private final AiActCertificateService certificateService;
    private final BadgeImageService badgeImageService;

    @GetMapping("/verify/ai/{token}")
    public ResponseEntity<AiActPublicVerificationResponse> getPublicVerification(@PathVariable String token) {
        AiActPublicVerificationResponse payload = certificateService.getPublicVerification(token);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(2)).cachePublic())
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                .body(payload);
    }

    @GetMapping(value = "/badge/ai/{token}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getBadge(@PathVariable String token) {
        AiActPublicVerificationResponse payload = certificateService.getPublicVerification(token);

        double score = payload.getReadinessScore() == null ? 0.0 : payload.getReadinessScore();
        BadgeImageService.BadgeState state = badgeImageService.fromScore(score);
        byte[] png = badgeImageService.renderBadgePng(payload.getSystemName(), score, state, false);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(2)).cachePublic())
                .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                .body(png);
    }
}
