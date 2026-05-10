package com.complianceai.service;

import com.complianceai.model.Competitor;
import com.complianceai.model.User;
import com.complianceai.repository.CompetitorRepository;
import com.complianceai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CompetitorService {

    private final CompetitorRepository competitorRepository;
    private final UserRepository userRepository;
    private final ScanService scanService;

    public Competitor addCompetitor(String userEmail, Competitor competitor) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Scan competitor website
        var scanResult = scanService.performFreeScan(competitor.getUrl());

        competitor.setUserId(user.getId());
        competitor.setComplianceScore(scanResult.getScore());
        competitor.setLastScan(LocalDateTime.now());
        competitor.setCreatedAt(LocalDateTime.now());

        return competitorRepository.save(competitor);
    }

    public List<Competitor> getUserCompetitors(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return competitorRepository.findByUserId(user.getId());
    }

    public void removeCompetitor(String userEmail, String id) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Competitor competitor = competitorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Competitor not found"));

        if (!competitor.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        competitorRepository.delete(competitor);
    }

    public Map<String, Object> generateReport(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Competitor> competitors = competitorRepository.findByUserId(user.getId());

        double avgScore = competitors.stream()
                .mapToDouble(Competitor::getComplianceScore)
                .average()
                .orElse(0);

        return Map.of(
                "competitors", competitors,
                "averageScore", avgScore,
                "totalCompetitors", competitors.size(),
                "generatedAt", LocalDateTime.now());
    }
}
