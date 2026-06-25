package com.zenvyra.scheduler;

import com.zenvyra.service.EmailService;
import com.zenvyra.system.BackupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BackupScheduler {

    private final BackupService backupService;
    private final EmailService emailService;

    @Value("${app.ops-alert-email:}")
    private String opsAlertEmail;

    @Scheduled(fixedRate = 3600000)
    public void autoBackup() {
        try {
            backupService.backup();
        } catch (Exception e) {
            log.error("Scheduled backup failed", e);
            sendFailureAlert(e.getMessage());
        }
    }

    private void sendFailureAlert(String status) {
        if (opsAlertEmail == null || opsAlertEmail.isBlank()) {
            log.warn("Backup failure alert skipped because app.ops-alert-email is not configured");
            return;
        }
        emailService.sendAdminBackupFailureAlertEmail(opsAlertEmail, status);
    }
}
