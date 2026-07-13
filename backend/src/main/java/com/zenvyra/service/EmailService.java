package com.zenvyra.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.zenvyra.util.LogSanitizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

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
        message.setSubject("Welcome to Zenvyra!");
        message.setText(String.format("""
                Hi %s,

                Welcome to Zenvyra! Your account has been created successfully.

                Get started by:
                1. Adding your first website
                2. Running a compliance scan
                3. Generating your privacy policy

                Best regards,
                The Zenvyra Team
                """, name));

        try {
            mailSender.send(message);
            log.info("Welcome email sent to {}", LogSanitizer.email(to));
        } catch (Exception e) {
            log.warn("Could not send welcome email to {}: {}", LogSanitizer.email(to), LogSanitizer.message(e.getMessage()));
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
            log.warn("Could not send password reset email to {}: {}", LogSanitizer.email(to), LogSanitizer.message(e.getMessage()));
        }
    }

    public void sendVerifyEmail(String to, String token) {
        sendSimpleOperationalEmail(
                to,
                "Verify your Zenvyra email",
                String.format("""
                        Hi,

                        Verify your email address to keep your Zenvyra account secure.

                        Verification link:
                        %s/auth/verify-email?token=%s

                        If you did not create this account, you can ignore this email.

                        Best regards,
                        The Zenvyra Team
                        """, appUrl, valueOr(token, "")));
    }

    public void sendOnboardingIncompleteReminderEmail(String to) {
        sendSimpleOperationalEmail(
                to,
                "Finish your Zenvyra setup",
                String.format("""
                        Hi,

                        Your setup intake is still incomplete. Finish onboarding so we can prepare privacy, consent, DSAR, AI readiness, certificate, and proof-pack workflows.

                        Continue setup:
                        %s/onboarding

                        Best regards,
                        The Zenvyra Team
                        """, appUrl));
    }

    public void sendTeamInvitation(String to, String teamName, String inviterName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("You've been invited to join " + teamName);
        message.setText(String.format("""
                Hi,

                %s has invited you to join the team "%s" on Zenvyra.

                Click here to accept: %s/team/invite

                Best regards,
                The Zenvyra Team
                """, inviterName, teamName, appUrl));

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Could not send team invitation to {}: {}", LogSanitizer.email(to), LogSanitizer.message(e.getMessage()));
        }
    }

    /**
     * Sends a tokenized team-invite email. The token in the URL is the
     * accept endpoint's opaque identifier; the invitee must be signed up
     * with the same email address before they can accept.
     */
    public void sendTeamInviteEmail(String toEmail, String token, String organizationName, String role) {
        String acceptUrl = appUrl + "/team/invite/" + token;
        sendSimpleOperationalEmail(
                toEmail,
                "You're invited to join " + organizationName + " on Zenvyra",
                String.format("""
                        Hi,

                        You have been invited to join %s on Zenvyra as %s.

                        Accept invite:
                        %s

                        This invite expires in 7 days. If you do not yet have a Zenvyra account, you will be asked to sign up first.

                        Best regards,
                        The Zenvyra Team
                        """,
                        valueOr(organizationName, "an organization"),
                        valueOr(role, "member"),
                        acceptUrl));
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
                The Zenvyra Team
                """, url, score, appUrl));

        try {
            mailSender.send(message);
            log.info("Low score email alert sent to {}", LogSanitizer.email(to));
        } catch (Exception e) {
            log.warn("Could not send low score alert to {}: {}", LogSanitizer.email(to), LogSanitizer.message(e.getMessage()));
        }
    }

    public void sendPolicyAutoUpdatedEmail(
            String to,
            String websiteUrl,
            String policyTitle,
            java.util.List<String> newDomains,
            String publicPolicyUrl) {
        int trackerCount = newDomains != null ? newDomains.size() : 0;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Privacy Policy updated for " + websiteUrl);
        message.setText(String.format("""
                Hi,

                We updated your Privacy Policy automatically because we detected %d new tracking script cookies.

                Website:
                %s

                Newly detected tracker domains:

                %s

                We regenerated "%s" and saved a new timestamped version automatically.

                Public hosted policy:
                %s

                Please review the update in your dashboard if your legal workflow requires approval.

                Best regards,
                The Zenvyra Team
                """,
                trackerCount,
                websiteUrl,
                String.join("\n", safeList(newDomains).stream().map(domain -> "- " + domain).toList()),
                policyTitle,
                publicPolicyUrl));

        try {
            mailSender.send(message);
            log.info("Policy auto-update email sent to {}", LogSanitizer.email(to));
        } catch (Exception e) {
            log.warn("Could not send policy auto-update email to {}: {}", LogSanitizer.email(to), LogSanitizer.message(e.getMessage()));
        }
    }

    public void sendSetupPackReadyEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);
            log.info("Setup pack ready email sent to {}", LogSanitizer.email(to));
        } catch (Exception e) {
            log.warn("Could not send setup pack ready email to {}: {}", LogSanitizer.email(to), LogSanitizer.message(e.getMessage()));
        }
    }

    public void sendSetupPaymentReceivedEmail(String to, String websiteUrl) {
        sendSimpleOperationalEmail(
                to,
                "Setup payment received",
                String.format("""
                        Hi,

                        We received payment for your founder-led setup package.

                        Website:
                        %s

                        Your setup task remains in the operator workflow. We will send the setup pack when the handoff is ready.

                        This is operational implementation support, not legal advice.

                        Best regards,
                        The Zenvyra Team
                        """, valueOr(websiteUrl, "Website pending")));
    }

    public void sendPaymentFailedEmail(String to) {
        sendSimpleOperationalEmail(
                to,
                "Payment failed",
                String.format("""
                        Hi,

                        A payment attempt for your Zenvyra subscription failed.

                        Please review billing in your dashboard:
                        %s/dashboard/billing

                        Best regards,
                        The Zenvyra Team
                        """, appUrl));
    }

    public void sendSubscriptionCancelledEmail(String to) {
        sendSimpleOperationalEmail(
                to,
                "Subscription cancelled",
                String.format("""
                        Hi,

                        Your Zenvyra subscription was cancelled or expired. Your account has been moved back to the free plan.

                        You can review billing options here:
                        %s/dashboard/billing

                        Best regards,
                        The Zenvyra Team
                        """, appUrl));
    }

    public void sendInstallVerificationEmail(String to, String websiteUrl, boolean success, java.util.List<String> findings) {
        sendSimpleOperationalEmail(
                to,
                success ? "Install verification passed" : "Install verification needs attention",
                String.format("""
                        Hi,

                        Install verification for %s %s.

                        Findings:
                        %s

                        Review your setup pack:
                        %s/dashboard

                        Best regards,
                        The Zenvyra Team
                        """,
                        valueOr(websiteUrl, "your website"),
                        success ? "passed" : "needs attention",
                        String.join("\n", safeList(findings).stream().map(item -> "- " + item).toList()),
                        appUrl));
    }

    public void sendProofReportReadyEmail(String to, String websiteUrl, String proofReportUrl) {
        sendSimpleOperationalEmail(
                to,
                "Proof report ready",
                String.format("""
                        Hi,

                        Your proof report is ready for review.

                        Website:
                        %s

                        Report:
                        %s

                        This report is operational readiness evidence, not legal advice or a guarantee of legal compliance.

                        Best regards,
                        The Zenvyra Team
                        """,
                        valueOr(websiteUrl, "Website pending"),
                        valueOr(proofReportUrl, appUrl + "/dashboard")));
    }

    public void sendCertificateIssuedEmail(String to, String websiteUrl, String certificateUrl) {
        sendSimpleOperationalEmail(
                to,
                "Public certificate issued",
                String.format("""
                        Hi,

                        A public readiness certificate has been issued.

                        Website:
                        %s

                        Certificate:
                        %s

                        Public certificates expose only privacy-safe readiness evidence and are not legal certification.

                        Best regards,
                        The Zenvyra Team
                        """,
                        valueOr(websiteUrl, "Website pending"),
                        valueOr(certificateUrl, appUrl + "/dashboard")));
    }

    public void sendMonthlyProofPackEmail(String to, String websiteUrl, String proofReportUrl, String certificateUrl) {
        sendSimpleOperationalEmail(
                to,
                "Monthly proof pack ready",
                String.format("""
                        Hi,

                        Your monthly proof pack is ready.

                        Website:
                        %s

                        Proof report:
                        %s

                        Public certificate:
                        %s

                        Best regards,
                        The Zenvyra Team
                        """,
                        valueOr(websiteUrl, "Website pending"),
                        valueOr(proofReportUrl, appUrl + "/dashboard"),
                        valueOr(certificateUrl, appUrl + "/dashboard")));
    }

    public void sendNewTrackerDetectedEmail(String to, String websiteUrl, java.util.List<String> newDomains) {
        sendSimpleOperationalEmail(
                to,
                "New tracker detected",
                String.format("""
                        Hi,

                        Zenvyra detected new tracker domains on %s.

                        New domains:
                        %s

                        Review tracker classification and consent behavior in your dashboard.

                        Best regards,
                        The Zenvyra Team
                        """,
                        valueOr(websiteUrl, "your website"),
                        String.join("\n", safeList(newDomains).stream().map(domain -> "- " + domain).toList())));
    }

    public void sendAdminWebhookFailureAlertEmail(String to, String eventType, String deliveryId) {
        sendSimpleOperationalEmail(
                to,
                "Admin alert: webhook delivery failed",
                String.format("""
                        A webhook delivery failed and needs operator review.

                        Event:
                        %s

                        Delivery:
                        %s

                        Review:
                        %s/dashboard/admin
                        """,
                        valueOr(eventType, "unknown"),
                        valueOr(deliveryId, "unknown"),
                        appUrl));
    }

    public void sendAdminBackupFailureAlertEmail(String to, String status) {
        sendSimpleOperationalEmail(
                to,
                "Admin alert: backup failure",
                String.format("""
                        Backup monitoring reported a failure state.

                        Status:
                        %s

                        Review:
                        %s/dashboard/admin
                        """,
                        valueOr(status, "unknown"),
                        appUrl));
    }

    public void sendOpenAiCostAlertEmail(String to, double dailySpendUsd, double thresholdUsd) {
        sendSimpleOperationalEmail(
                to,
                "Admin alert: OpenAI daily cost threshold exceeded",
                String.format("""
                        OpenAI estimated daily spend has exceeded the configured threshold.

                        Estimated daily spend: $%.4f
                        Threshold: $%.4f

                        Review usage in the admin dashboard and consider adjusting rate limits or model selection.

                        Review:
                        %s/dashboard/admin
                        """,
                        dailySpendUsd,
                        thresholdUsd,
                        appUrl));
    }

    public void sendAgencyClientReportEmail(String to, String clientCompanyName, String websiteUrl, String proofReportUrl) {
        sendSimpleOperationalEmail(
                to,
                "Agency client proof report ready",
                String.format("""
                        Hi,

                        A monthly agency client proof report is ready for review.

                        Client:
                        %s

                        Website:
                        %s

                        Proof report:
                        %s

                        This report is operational readiness evidence, not legal advice or a guarantee of legal compliance.

                        Best regards,
                        The Zenvyra Team
                        """,
                        valueOr(clientCompanyName, "Client"),
                        valueOr(websiteUrl, "Website attached in dashboard"),
                        valueOr(proofReportUrl, appUrl + "/dashboard/agency")));
    }

    public void sendAgencyOutreachEmail(String to, String subject, String htmlContent, String textFallback) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(textFallback, htmlContent);
            mailSender.send(message);
            log.info("Agency outreach email sent to {}", LogSanitizer.email(to));
        } catch (Exception e) {
            log.error("Failed to send agency outreach email to {}: {}", LogSanitizer.email(to), LogSanitizer.exception(e));
            throw new RuntimeException("Agency outreach email sending failed", e);
        }
    }

    public void sendDsarDeadlineAlertEmail(String to, String requesterName, String requesterEmail, String requestType) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Regulatory Deadline: New Data Subject Request");
        message.setText(String.format("""
                Regulatory Deadline: You have a new Data Subject Request pending. 30 days remaining to fulfill.

                Requester:
                %s <%s>

                Request type:
                %s

                Review now:
                %s/dashboard/dsar

                Best regards,
                The Zenvyra Team
                """,
                valueOr(requesterName, "Unknown requester"),
                valueOr(requesterEmail, "unknown email"),
                valueOr(requestType, "Data Subject Request"),
                appUrl));

        try {
            mailSender.send(message);
            log.info("DSAR deadline alert email sent to {}", LogSanitizer.email(to));
        } catch (Exception e) {
            log.warn("Could not send DSAR deadline alert to {}: {}", LogSanitizer.email(to), LogSanitizer.message(e.getMessage()));
        }
    }

    private java.util.List<String> safeList(java.util.List<String> values) {
        return values == null ? java.util.List.of() : values;
    }

    private void sendSimpleOperationalEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);
            log.info("{} email sent to {}", subject, LogSanitizer.email(to));
        } catch (Exception e) {
            log.warn("Could not send {} email to {}: {}", subject, LogSanitizer.email(to), LogSanitizer.message(e.getMessage()));
        }
    }

    private String valueOr(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
