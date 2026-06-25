package com.zenvyra.controller;

import com.zenvyra.dto.response.admin.AdminOpsOverviewResponse;
import com.zenvyra.dto.response.admin.AdminOpsTableResponse;
import com.zenvyra.dto.request.UpdateSetupPackageTaskRequest;
import com.zenvyra.model.SetupPackageOrder;
import com.zenvyra.service.AdminOpsService;
import com.zenvyra.service.SetupPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/ops")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOpsController {

    private final AdminOpsService adminOpsService;
    private final SetupPackageService setupPackageService;

    @GetMapping("/overview")
    public AdminOpsOverviewResponse overview() {
        return adminOpsService.overview();
    }

    @GetMapping("/users")
    public AdminOpsTableResponse users() {
        return adminOpsService.users();
    }

    @GetMapping("/websites")
    public AdminOpsTableResponse websites() {
        return adminOpsService.websites();
    }

    @GetMapping("/subscriptions")
    public AdminOpsTableResponse subscriptions() {
        return adminOpsService.subscriptions();
    }

    @GetMapping("/webhooks")
    public AdminOpsTableResponse webhooks() {
        return adminOpsService.webhooks();
    }

    @GetMapping("/emails")
    public AdminOpsTableResponse emails() {
        return adminOpsService.emails();
    }

    @GetMapping("/monitoring")
    public AdminOpsTableResponse monitoring() {
        return adminOpsService.monitoring();
    }

    @GetMapping("/scans")
    public AdminOpsTableResponse scans() {
        return adminOpsService.scans();
    }

    @GetMapping("/backups")
    public AdminOpsTableResponse backups() {
        return adminOpsService.backups();
    }

    @GetMapping("/setup-tasks")
    public AdminOpsTableResponse setupTasks() {
        return adminOpsService.setupTasks();
    }

    @PatchMapping("/setup-tasks/{id}")
    public SetupPackageOrder updateSetupTask(@PathVariable String id, @RequestBody UpdateSetupPackageTaskRequest request) {
        return setupPackageService.updateAdminTask(id, request);
    }
}
