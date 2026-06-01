package com.complianceai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "banners")
public class Banner {
    @Id
    private String id;
    
    @Indexed
    private String organizationId;
    
    private String name;
    private String position; // Bottom, Top, Corner, Modal, Full
    private String layout; // Simple, Detailed, Minimal, Custom
    
    private Map<String, String> colors; // primary, background, text, button
    private Map<String, String> content; // headline, description, acceptText, rejectText, etc.
    
    private List<CookieCategory> categories;
    private List<LanguageConfig> languages;
    private List<RegionalRule> regionalRules;
    
    private Map<String, Object> advanced; // autoBlock, reloadOnChange, customCss, etc.
    private List<ABTest> abTests;
    
    private String embedCode;
    private String previewUrl;
    private String status; // draft, active, archived
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CookieCategory {
        private String name;
        private String description;
        private boolean enabled;
        private boolean defaultState;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LanguageConfig {
        private String language;
        private Map<String, String> content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionalRule {
        private List<String> countries;
        private String bannerVariant;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ABTest {
        private String variantName;
        private Map<String, Object> changes;
        private Integer trafficSplit;
        private boolean active;
    }
}
