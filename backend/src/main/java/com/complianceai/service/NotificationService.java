package com.complianceai.service;

import com.complianceai.model.Alert;
import com.complianceai.model.User;
import com.complianceai.repository.AlertRepository;
import com.complianceai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public void sendLowScoreAlert(String userEmail, String url, double score) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Alert alert = Alert.builder()
                .userId(user.getId())
                .type("low_score")
                .severity("high")
                .title("Low Compliance Score Detected")
                .message(String.format("Your website %s has a compliance score of %d/100", url, score))
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        alertRepository.save(alert);

        // Send email notification
        emailService.sendLowScoreEmail(userEmail, url, score);

        log.info("Low score alert sent to: {}", userEmail);
    }

    public void sendChangeDetectedAlert(String userEmail, String url, String changeType) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Alert alert = Alert.builder()
                .userId(user.getId())
                .type("change_detected")
                .severity("medium")
                .title("Website Change Detected")
                .message(String.format("Change detected on %s: %s", url, changeType))
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        alertRepository.save(alert);
    }

    public void sendSslExpiryAlert(String userEmail, String url, int daysRemaining) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Alert alert = Alert.builder()
                .userId(user.getId())
                .type("ssl_expiry")
                .severity(daysRemaining < 3 ? "critical" : "high")
                .title("SSL Certificate Expiring Soon")
                .message(String.format("SSL for %s expires in %d days", url, daysRemaining))
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        alertRepository.save(alert);
    }
}
