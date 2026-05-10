package com.complianceai.repository;

import com.complianceai.model.ScanResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanResultRepository extends MongoRepository<ScanResult, String> {

    List<ScanResult> findByWebsiteId(String websiteId);

    List<ScanResult> findByUserId(String userId);

    List<ScanResult> findByWebsiteIdOrderByScannedAtDesc(String websiteId);
}
