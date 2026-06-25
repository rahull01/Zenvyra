package com.zenvyra.repository;

import com.zenvyra.model.WebsiteScanResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebsiteScanResultRepository extends MongoRepository<WebsiteScanResult, String> {
    List<WebsiteScanResult> findByUserId(String userId);
    Optional<WebsiteScanResult> findTopByUserIdAndTargetUrlOrderByScannedAtDesc(String userId, String targetUrl);
}
