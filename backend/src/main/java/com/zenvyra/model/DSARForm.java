package com.zenvyra.model;

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
@Document(collection = "dsar_forms")
public class DSARForm {
    @Id
    private String id;
    
    @Indexed
    private String organizationId;
    
    private List<FormField> fields;
    private Map<String, String> styling; // colors, font
    private Map<String, String> deployOptions; // embedCode, directLink
    private String status;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FormField {
        private String type;
        private String label;
        private boolean required;
    }
}
