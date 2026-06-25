package com.zenvyra.system;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class BackupService {

    @Value("${app.backup.enabled:false}")
    private boolean backupEnabled;

    @Value("${app.backup.provider:}")
    private String backupProvider;

    @Value("${app.backup.last-restore-drill-at:}")
    private String lastRestoreDrillAt;

    public BackupStatus backup() {
        if (!backupEnabled) {
            log.info("Managed backup scheduler is disabled; relying on infrastructure/provider backups if configured");
            return BackupStatus.disabled();
        }
        if (backupProvider == null || backupProvider.isBlank()) {
            throw new IllegalStateException("Backup is enabled but app.backup.provider is not configured");
        }

        BackupStatus status = BackupStatus.configured(backupProvider, lastRestoreDrillAt);
        log.info("Backup readiness check completed: provider={}, restore_drill_recorded={}",
                status.getProvider(),
                status.isRestoreDrillRecorded());
        return status;
    }

    public static class BackupStatus {
        private final boolean enabled;
        private final boolean configured;
        private final String provider;
        private final String checkedAt;
        private final boolean restoreDrillRecorded;

        private BackupStatus(
                boolean enabled,
                boolean configured,
                String provider,
                String checkedAt,
                boolean restoreDrillRecorded) {
            this.enabled = enabled;
            this.configured = configured;
            this.provider = provider;
            this.checkedAt = checkedAt;
            this.restoreDrillRecorded = restoreDrillRecorded;
        }

        static BackupStatus disabled() {
            return new BackupStatus(false, false, "", Instant.now().toString(), false);
        }

        static BackupStatus configured(String provider, String lastRestoreDrillAt) {
            return new BackupStatus(
                    true,
                    true,
                    provider,
                    Instant.now().toString(),
                    lastRestoreDrillAt != null && !lastRestoreDrillAt.isBlank());
        }

        public boolean isEnabled() {
            return enabled;
        }

        public boolean isConfigured() {
            return configured;
        }

        public String getProvider() {
            return provider;
        }

        public String getCheckedAt() {
            return checkedAt;
        }

        public boolean isRestoreDrillRecorded() {
            return restoreDrillRecorded;
        }
    }
}
