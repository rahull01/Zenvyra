package com.complianceai.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "policies")
public class Policy {

    @Id
    private String id;

    private String userId;
    private String organizationId;
    private String websiteId;
    private String companySlug;

    private String type; // privacy, terms, cookie, gdpr, ccpa
    private String title;
    private String name;
    private String content; // HTML content
    private String plainText;
    private String language; // en, de, fr, es

    private Integer version;
    private String status; // draft, published, archived

    private String generatedBy; // ai, manual, template
    private String aiPrompt; // stored for regeneration

    private List<String> applicableCountries;
    private List<String> complianceFrameworks;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;

    @Builder.Default
    private Boolean needsReview = false;

    private LocalDateTime nextReviewAt;
}
