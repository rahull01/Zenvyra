package com.zenvyra.service;

import com.zenvyra.model.DSARSubmission;
import com.zenvyra.model.Organization;
import com.zenvyra.model.User;
import com.zenvyra.repository.DSARFormRepository;
import com.zenvyra.repository.DSARSubmissionRepository;
import com.zenvyra.repository.OrganizationRepository;
import com.zenvyra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class DsarService {

    private final DSARSubmissionRepository dsarSubmissionRepository;
    private final DSARFormRepository dsarFormRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final WebhookDispatchService webhookDispatchService;

    public DSARSubmission submitRequest(DSARSubmission submission) {
        submission.setCreatedAt(LocalDateTime.now());
        submission.setStatus("new");
        // GDPR allows 30 days to process DSARs
        submission.setDueDate(LocalDateTime.now().plusDays(30));
        DSARSubmission saved = dsarSubmissionRepository.save(submission);
        notifyCompanyAdmin(saved);
        return saved;
    }

    public List<DSARSubmission> getSubmissionsByForm(String formId) {
        return dsarSubmissionRepository.findByFormId(formId);
    }

    public List<DSARSubmission> getAllSubmissions() {
        return dsarSubmissionRepository.findAll();
    }

    public Optional<DSARSubmission> updateStatus(String submissionId, String status) {
        return dsarSubmissionRepository.findById(submissionId).map(sub -> {
            sub.setStatus(status);
            if ("completed".equalsIgnoreCase(status)) {
                sub.setCompletedAt(LocalDateTime.now());
            }
            return dsarSubmissionRepository.save(sub);
        });
    }

    private void notifyCompanyAdmin(DSARSubmission submission) {
        if (submission.getFormId() == null || submission.getFormId().isBlank()) {
            log.warn("Skipping DSAR admin alert because submission {} has no formId", submission.getId());
            return;
        }

        dsarFormRepository.findById(submission.getFormId())
                .flatMap(form -> {
                    String organizationId = form.getOrganizationId();
                    if (organizationId == null || organizationId.isBlank()) {
                        return Optional.empty();
                    }
                    return organizationRepository.findById(organizationId);
                })
                .map(Organization::getOwnerId)
                .flatMap(userRepository::findById)
                .ifPresentOrElse(
                        admin -> sendAdminAlerts(admin, submission),
                        () -> log.warn("No admin found for DSAR submission {} and form {}", submission.getId(), submission.getFormId()));
    }

    private void sendAdminAlerts(User admin, DSARSubmission submission) {
        notificationService.sendDsarDeadlineAlert(admin.getId());
        emailService.sendDsarDeadlineAlertEmail(
                admin.getEmail(),
                submission.getName(),
                submission.getEmail(),
                submission.getRequestType());
        webhookDispatchService.dispatch(admin.getId(), "dsar.critical.created", java.util.Map.of(
                "submissionId", submission.getId(),
                "formId", submission.getFormId(),
                "requestType", submission.getRequestType() != null ? submission.getRequestType() : "Data Subject Request",
                "requesterEmail", submission.getEmail() != null ? submission.getEmail() : "",
                "dueDate", submission.getDueDate() != null ? submission.getDueDate().toString() : ""));
    }
}
