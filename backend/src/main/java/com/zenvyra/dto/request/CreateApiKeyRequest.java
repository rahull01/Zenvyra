package com.zenvyra.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateApiKeyRequest {
    @NotBlank
    @Size(max = 80)
    private String name;
    @Size(max = 16)
    private List<@Size(max = 64) String> scopes;
    private LocalDateTime expiresAt;
}
