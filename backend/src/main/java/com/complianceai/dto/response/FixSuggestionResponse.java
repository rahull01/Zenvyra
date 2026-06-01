package com.complianceai.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class FixSuggestionResponse {
    private String issueType;
    private String title;
    private String description;
    
    // Option 1: Code Snippet
    private String codeSnippet;
    private String language; // html, javascript, etc.
    
    // Option 2: Full Page / File Content
    private String fullContent;
    private String fileName;
    
    // Option 3: Step-by-step Guide
    private List<String> steps;
    
    private String aiExplanation;
}
