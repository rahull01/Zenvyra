package com.zenvyra.dto.response.admin;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AdminOpsOverviewResponse {
    private long totalUsers;
    private long activeUsers;
    private long agencyAccounts;
    private long totalWebsites;
    private long monitoredWebsites;
    private double averageScore;
    private long openIssues;
    private long pendingDsars;
    private long activeSubscriptions;
    private long monthlyRecurringRevenueEstimate;
    private long failedWebhookCount;
    private long recentScanCount;
    private List<Map<String, Object>> systemHealthStates;
    private List<Map<String, Object>> highRiskAccounts;
    private List<Map<String, Object>> launchChecklist;
}
