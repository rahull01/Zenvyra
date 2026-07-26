package com.zenvyra.security;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.PlanStatus;
import com.zenvyra.model.PlanType;
import com.zenvyra.model.User;
import com.zenvyra.repository.PolicyRepository;
import com.zenvyra.repository.ScanResultRepository;
import com.zenvyra.repository.UserRepository;
import com.zenvyra.repository.WebsiteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.List;
import java.util.Map;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class CompliancePlanInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;
    private final WebsiteRepository websiteRepository;
    private final ScanResultRepository scanResultRepository;
    private final PolicyRepository policyRepository;
    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        RequiresCompliancePlan requirement = handlerMethod.getMethodAnnotation(RequiresCompliancePlan.class);
        if (requirement == null) {
            requirement = handlerMethod.getBeanType().getAnnotation(RequiresCompliancePlan.class);
        }
        if (requirement == null) {
            return true;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw ApiException.unauthorized("Authentication required");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));
        PlanType planType = user.getPlanType() == null ? PlanType.from(user.getPlan()) : user.getPlanType();
        PlanStatus status = user.getPlanStatus() == null ? PlanStatus.ACTIVE : user.getPlanStatus();
        List<String> features = user.getFeaturesEnabled() == null ? planType.getFeaturesEnabled() : user.getFeaturesEnabled();

        boolean allowed = status == PlanStatus.ACTIVE || status == PlanStatus.TRIALING;
        allowed = allowed && planType.ordinal() >= requirement.value().ordinal();
        allowed = allowed && (requirement.feature().isBlank() || features.contains(requirement.feature()));

        if (allowed && requirement.enforceWebsiteQuota()) {
            int max = user.getMaxWebsitesAllowed() == null ? planType.getMaxWebsitesAllowed() : user.getMaxWebsitesAllowed();
            allowed = websiteRepository.countByUserId(user.getId()) < max;
        }

        // Enforce scan quota (daily count)
        if (allowed && requirement.enforceScanQuota()) {
            int max = planType.getMaxScansAllowed();
            allowed = scanResultRepository.countByUserId(user.getId()) < max;
        }

        // Enforce policy quota
        if (allowed && requirement.enforcePolicyQuota()) {
            int max = planType.getMaxPoliciesAllowed();
            long current = policyRepository.countByUserId(user.getId());
            allowed = current < max;
        }

        if (!allowed) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("application/json");
            objectMapper.writeValue(response.getWriter(), Map.of(
                    "message", "Plan upgrade required",
                    "requiredPlan", requirement.value().name(),
                    "requiredFeature", requirement.feature(),
                    "currentPlan", planType.name()
            ));
            return false;
        }
        return true;
    }
}
