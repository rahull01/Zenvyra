package com.zenvyra.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PolicyRequest {
    private String websiteId;
    private String title;
    private String content;
    private String category;
    private String type;
    private String language;
}
