package com.zenvyra.service;

import com.zenvyra.model.AgencyOutreachLead;
import com.zenvyra.model.AgencyOutreachLead.OutreachStatus;
import com.zenvyra.model.EmailTemplate;
import com.zenvyra.repository.AgencyOutreachLeadRepository;
import com.zenvyra.repository.EmailTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgencyOutreachService {
    public static final String AGENCY_INITIAL_TEMPLATE_KEY = "agency-outreach-initial";

    private final AgencyOutreachLeadRepository leadRepository;
    private final EmailTemplateRepository templateRepository;
    private final TemplateRenderer templateRenderer;
    private final EmailService emailService;

    public int executeAgencyOutreachSequence() {
        EmailTemplate template = templateRepository.findByKeyAndActiveTrue(AGENCY_INITIAL_TEMPLATE_KEY)
                .orElseGet(this::saveDefaultAgencyTemplate);

        int sentCount = 0;
        for (AgencyOutreachLead lead : leadRepository.findTop25ByStatusOrderByCreatedAtAsc(OutreachStatus.PROSPECT)) {
            if (lead.getEmail() == null || lead.getEmail().isBlank()) {
                log.warn("Skipping agency outreach lead {} because email is blank", lead.getId());
                continue;
            }

            Map<String, String> variables = Map.of(
                    "Agency Name", valueOr(lead.getAgencyName(), "your agency"),
                    "Contact Name", valueOr(lead.getContactName(), "there")
            );
            String subject = templateRenderer.render(template.getSubjectTemplate(), variables);
            String html = templateRenderer.render(template.getHtmlTemplate(), variables);
            String text = templateRenderer.render(template.getTextTemplate(), variables);

            emailService.sendAgencyOutreachEmail(lead.getEmail(), subject, html, text);

            LocalDateTime now = LocalDateTime.now();
            lead.setStatus(OutreachStatus.EMAIL_SENT);
            lead.setLastEmailedAt(now);
            lead.setUpdatedAt(now);
            leadRepository.save(lead);
            sentCount++;
        }

        log.info("Agency outreach sequence sent {} emails", sentCount);
        return sentCount;
    }

    private EmailTemplate saveDefaultAgencyTemplate() {
        return templateRepository.save(defaultAgencyTemplate());
    }

    private EmailTemplate defaultAgencyTemplate() {
        LocalDateTime now = LocalDateTime.now();
        String body = """
                Hi [Contact Name],

                I noticed your agency designs incredible websites. Managing custom GDPR banner scripts and legal tracking compliance frameworks manually for 20+ scaling clients eats up senior dev time.

                We built Zenvyra Agency Hub - you can whitelist your own corporate brand, control 50 customer sites from 1 single login screen, and automate 'set-and-forget' dynamic policy updates.

                I would love to spin up a fully free 30-day extended white-label dashboard trial key for your team. Would you like me to drop the activation link?
                """;

        return EmailTemplate.builder()
                .key(AGENCY_INITIAL_TEMPLATE_KEY)
                .subjectTemplate("Quick question about [Agency Name]'s client compliance setups")
                .textTemplate(body)
                .htmlTemplate("""
                        <p>Hi [Contact Name],</p>
                        <p>I noticed your agency designs incredible websites. Managing custom GDPR banner scripts and legal tracking compliance frameworks manually for 20+ scaling clients eats up senior dev time.</p>
                        <p>We built Zenvyra Agency Hub - you can whitelist your own corporate brand, control 50 customer sites from 1 single login screen, and automate 'set-and-forget' dynamic policy updates.</p>
                        <p>I would love to spin up a fully free 30-day extended white-label dashboard trial key for your team. Would you like me to drop the activation link?</p>
                        """)
                .active(true)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    private String valueOr(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
