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
@Document(collection = "tracker_dictionary")
public class TrackerDictionaryEntry {

    @Id
    private String id;

    @Indexed(unique = true)
    private String domain;

    private String serviceName;
    private String category;
    private String purposeDescription;
    private String source;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
