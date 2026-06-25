package com.zenvyra.scheduler;

import com.zenvyra.service.AgencyOutreachService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AgencyOutreachScheduler {
    private final AgencyOutreachService agencyOutreachService;

    @Value("${outreach.agency.enabled:false}")
    private boolean enabled;

    @Scheduled(cron = "${outreach.agency.cron:0 30 10 * * MON-FRI}")
    public void runAgencyOutreachSequence() {
        if (!enabled) {
            log.debug("Agency outreach scheduler is disabled");
            return;
        }

        agencyOutreachService.executeAgencyOutreachSequence();
    }
}
