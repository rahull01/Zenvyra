package com.zenvyra.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, max = 128)
    private String password;

    @NotBlank
    @Size(min = 2, max = 120)
    private String fullName;

    @Size(max = 200)
    private String companyName;
    private String industry;
    @Size(max = 50)
    private String employeeCount;
    @Size(max = 300)
    private String websiteUrl;
    @Size(max = 50)
    private String accountType;
    @Size(max = 50)
    private String primaryRegion;
    @Size(max = 80)
    private String platform;
    private List<String> aiUsage;
}
