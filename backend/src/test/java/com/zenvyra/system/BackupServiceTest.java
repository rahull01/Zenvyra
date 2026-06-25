package com.zenvyra.system;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BackupServiceTest {

    @Test
    void disabledBackupReportsDisabledWithoutFakeSuccess() {
        BackupService service = new BackupService();
        ReflectionTestUtils.setField(service, "backupEnabled", false);

        BackupService.BackupStatus status = service.backup();

        assertThat(status.isEnabled()).isFalse();
        assertThat(status.isConfigured()).isFalse();
    }

    @Test
    void enabledBackupRequiresProviderConfiguration() {
        BackupService service = new BackupService();
        ReflectionTestUtils.setField(service, "backupEnabled", true);
        ReflectionTestUtils.setField(service, "backupProvider", "");

        assertThatThrownBy(service::backup)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("app.backup.provider");
    }

    @Test
    void configuredBackupReportsRestoreDrillState() {
        BackupService service = new BackupService();
        ReflectionTestUtils.setField(service, "backupEnabled", true);
        ReflectionTestUtils.setField(service, "backupProvider", "atlas");
        ReflectionTestUtils.setField(service, "lastRestoreDrillAt", "2026-06-16T10:00:00Z");

        BackupService.BackupStatus status = service.backup();

        assertThat(status.isEnabled()).isTrue();
        assertThat(status.isConfigured()).isTrue();
        assertThat(status.getProvider()).isEqualTo("atlas");
        assertThat(status.isRestoreDrillRecorded()).isTrue();
    }
}
