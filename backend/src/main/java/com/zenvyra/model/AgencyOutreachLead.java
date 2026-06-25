package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "agency_outreach_leads")
public class AgencyOutreachLead {
    @Id
    private String id;

    private String agencyName;
    private String contactName;

    @Indexed(unique = true, sparse = true)
    private String email;

    @Builder.Default
    private OutreachStatus status = OutreachStatus.PROSPECT;

    private LocalDateTime lastEmailedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum OutreachStatus {
        PROSPECT,
        EMAIL_SENT,
        TRIAL_STARTED,
        CONVERTED
    }
}
