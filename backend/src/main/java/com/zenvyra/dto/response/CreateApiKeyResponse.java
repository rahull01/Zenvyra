package com.zenvyra.dto.response;

import com.zenvyra.model.ApiKey;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateApiKeyResponse {
    private ApiKey apiKey;
    private String token;
}
