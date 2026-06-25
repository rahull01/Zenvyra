package com.zenvyra.repository;

import com.zenvyra.model.ScanAuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanAuditLogRepository extends MongoRepository<ScanAuditLog, String> {
    List<ScanAuditLog> findTop10ByUserIdOrderByCreatedAtDesc(String userId);
    List<ScanAuditLog> findTop10ByWebsiteIdOrderByCreatedAtDesc(String websiteId);
}
