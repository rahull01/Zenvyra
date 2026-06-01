package com.complianceai.scheduler;

import com.complianceai.system.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BackupScheduler {

    private final BackupService backupService;

    @Scheduled(fixedRate = 3600000)
    public void autoBackup() {
        backupService.backup();
    }
}
