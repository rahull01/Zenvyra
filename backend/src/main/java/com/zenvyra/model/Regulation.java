package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "regulations")
public class Regulation {
    @Id
    private String id;
    private String name;
    private String region;
    private String fullName;
    private LocalDateTime effectiveDate;
    private String status; // active, draft, superseded
    private String summary; // AI-generated
    private List<String> keyRequirements;
    private LocalDateTime lastUpdated;
}
