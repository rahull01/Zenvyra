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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cookie_scans")
public class CookieScan {
    @Id
    private String id;
    
    @Indexed
    private String websiteId;
    
    private String status; // pending, running, completed, failed
    private List<CookieInfo> cookies;
    private Integer totalCookies;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CookieInfo {
        private String name;
        private String domain;
        private String type;
        private String duration;
        private String description;
        private String category; // Essential, Analytics, Marketing, Functional, Social
        private boolean firstParty;
        private boolean blocked;
    }
}
