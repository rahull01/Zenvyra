package com.zenvyra.repository;

import com.zenvyra.model.ConsentAuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsentAuditLogRepository extends MongoRepository<ConsentAuditLog, String> {
    List<ConsentAuditLog> findBySiteIdOrderByTimestampDesc(String siteId);
    long countBySiteId(String siteId);
    long countBySiteIdAndConsentStateContaining(String siteId, String value);
}
