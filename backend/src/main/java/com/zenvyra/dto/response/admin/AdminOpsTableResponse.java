package com.zenvyra.dto.response.admin;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AdminOpsTableResponse {
    private String name;
    private long total;
    private List<Map<String, Object>> items;
}
