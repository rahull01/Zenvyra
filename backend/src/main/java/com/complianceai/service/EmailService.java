package com.complianceai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    public void sendWelcomeEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Welcome to ComplianceAI Pro!");
        message.setText(String.format("""
                Hi %s,

                Welcome to ComplianceAI Pro! Your account has been created successfully.

                Get started by:
                1. Adding your first website
                2. Running a compliance scan
                3. Generating your privacy policy

                Best regards,
                The ComplianceAI Team
                """, name));

        try {
            mailSender.send(message);
            log.info("Welcome email sent to: {}", to);
        } catch (Exception e) {
            log.warn("Could not send welcome email to {}: {}", to, e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText(String.format("""
                You requested a password reset.

                Click the link below to reset your password:
                %s/reset-password?token=%s

                If you didn't request this, please ignore this email.
                """, appUrl, token));

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not send password reset email to {}: {}", to, e.getMessage());
        }
    }

    public void sendTeamInvitation(String to, String teamName, String inviterName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("You've been invited to join " + teamName);
        message.setText(String.format("""
                Hi,

                %s has invited you to join the team "%s" on ComplianceAI Pro.

                Click here to accept: %s/team/invite

                Best regards,
                The ComplianceAI Team
                """, inviterName, teamName, appUrl));

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not send team invitation to {}: {}", to, e.getMessage());
        }
    }

    public void sendLowScoreEmail(String to, String url, double score) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Alert: Low Compliance Score for " + url);
        message.setText(String.format("""
                Hi,

                The compliance scan for %s returned a score of %.1f/100.
                
                Several high-priority issues were detected that may put your site at risk. 
                Please log in to your dashboard to review and fix these issues.

                View report: %s/dashboard/monitoring

                Best regards,
                The ComplianceAI Team
                """, url, score, appUrl));

        try {
            mailSender.send(message);
            log.info("Low score email alert sent to: {}", to);
        } catch (Exception e) {
            log.warn("Could not send low score alert to {}: {}", to, e.getMessage());
        }
    }

    public void sendPolicyAutoUpdatedEmail(
            String to,
            String websiteUrl,
            String policyTitle,
            java.util.List<String> newDomains,
            String publicPolicyUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Your hosted policy was updated for " + websiteUrl);
        message.setText(String.format("""
                Hi,

                ComplianceAI Pro completed the monthly audit for %s and found new tracking domains:

                %s

                We regenerated "%s" and saved a new timestamped version automatically.

                Public hosted policy:
                %s

                Please review the update in your dashboard if your legal workflow requires approval.

                Best regards,
                The ComplianceAI Team
                """,
                websiteUrl,
                String.join("\n", newDomains.stream().map(domain -> "- " + domain).toList()),
                policyTitle,
                publicPolicyUrl));

        try {
            mailSender.send(message);
            log.info("Policy auto-update email sent to: {}", to);
        } catch (Exception e) {
            log.warn("Could not send policy auto-update email to {}: {}", to, e.getMessage());
        }
    }
}
