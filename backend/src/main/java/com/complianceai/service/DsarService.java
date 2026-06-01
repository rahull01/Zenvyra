package com.complianceai.service;

import com.complianceai.model.DSARSubmission;
import com.complianceai.repository.DSARSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DsarService {

    private final DSARSubmissionRepository dsarSubmissionRepository;

    public DSARSubmission submitRequest(DSARSubmission submission) {
        submission.setCreatedAt(LocalDateTime.now());
        submission.setStatus("new");
        // GDPR allows 30 days to process DSARs
        submission.setDueDate(LocalDateTime.now().plusDays(30));
        return dsarSubmissionRepository.save(submission);
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
}
