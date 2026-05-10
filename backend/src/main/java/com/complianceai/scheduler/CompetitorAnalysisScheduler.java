package com.complianceai.scheduler;

import com.complianceai.model.Competitor;
import com.complianceai.model.User;
import com.complianceai.repository.CompetitorRepository;
import com.complianceai.repository.UserRepository;
import com.complianceai.service.ScanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CompetitorAnalysisScheduler {

    private final CompetitorRepository competitorRepository;
    private final UserRepository userRepository;
    private final ScanService scanService;

    // Run every Monday at 9 AM
    @Scheduled(cron = "0 0 9 * * MON")
    public void runWeeklyCompetitorAnalysis() {
        log.info("Starting weekly competitor analysis at {}", LocalDateTime.now());

        List<Competitor> competitors = competitorRepository.findAll();

        for (Competitor competitor : competitors) {
            try {
                log.info("Analyzing competitor: {}", competitor.getUrl());

                // Scan competitor website
                var result = scanService.performFreeScan(competitor.getUrl());

                // Update competitor data
                Competitor.ScoreHistory history = Competitor.ScoreHistory.builder()
                        .date(LocalDateTime.now())
                        .score(result.getScore())
                        .changes(detectChanges(competitor.getComplianceScore(), result.getScore()))
                        .build();

                competitor.getHistory().add(history);
                competitor.setComplianceScore(result.getScore());
                competitor.setLastScan(LocalDateTime.now());

                // Check for significant changes
                if (Math.abs(competitor.getComplianceScore() - result.getScore()) > 10) {
                    Competitor.CompetitorAlert alert = Competitor.CompetitorAlert.builder()
                            .type("score_drop")
                            .message(String.format("Competitor %s score changed from %.1f to %.1f",
                                    competitor.getUrl(), competitor.getComplianceScore(), result.getScore()))
                            .createdAt(LocalDateTime.now())
                            .build();

                    competitor.getAlerts().add(alert);
                }

                competitorRepository.save(competitor);

            } catch (Exception e) {
                log.error("Failed to analyze competitor: {}", competitor.getUrl(), e);
            }
        }

        log.info("Weekly competitor analysis completed");
    }

    private List<String> detectChanges(Double oldScore, Double newScore) {
        List<String> changes = new java.util.ArrayList<>();

        if (oldScore != null) {
            if (newScore > oldScore) {
                changes.add(String.format("Score improved by %.1f points", (newScore - oldScore)));
            } else if (newScore < oldScore) {
                changes.add(String.format("Score dropped by %.1f points", (oldScore - newScore)));
            }
        }

        return changes;
    }
}
