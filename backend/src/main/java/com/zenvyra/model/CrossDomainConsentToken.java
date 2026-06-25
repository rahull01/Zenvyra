package com.zenvyra.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cross_domain_consent_tokens")
@CompoundIndexes({
        @CompoundIndex(name = "enterprise_anon_idx", def = "{'enterpriseConsentKey': 1, 'anonymousUserId': 1}", unique = true)
})
public class CrossDomainConsentToken {
    @Id
    private String id;
    private String enterpriseConsentKey;
    private String anonymousUserId;
    private String consentState;
    private LocalDateTime updatedAt;
}
