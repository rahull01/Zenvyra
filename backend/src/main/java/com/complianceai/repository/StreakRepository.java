package com.complianceai.repository;

import com.complianceai.model.ComplianceStreak;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface StreakRepository extends MongoRepository<ComplianceStreak, String> {
    Optional<ComplianceStreak> findByWebsiteId(String websiteId);
    Optional<ComplianceStreak> findByUserId(String userId);
}
