package com.zenvyra.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateWebhookRequest {
    @NotBlank
    @Size(max = 500)
    private String url;
    @Size(max = 24)
    private List<@Size(max = 80) String> events;
}
