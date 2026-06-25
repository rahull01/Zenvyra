package com.zenvyra.dto.response;

import com.zenvyra.model.SetupPackageOrder;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SetupPackageResponse {
    private SetupPackageOrder order;
    private String checkoutUrl;
    private String message;
}
