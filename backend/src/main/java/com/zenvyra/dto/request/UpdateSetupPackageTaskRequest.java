package com.zenvyra.dto.request;

import lombok.Data;

@Data
public class UpdateSetupPackageTaskRequest {
    private String setupStatus;
    private String adminNotes;
}
