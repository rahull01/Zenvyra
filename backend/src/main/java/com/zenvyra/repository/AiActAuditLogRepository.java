package com.zenvyra.repository;

import com.zenvyra.model.AiActAuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiActAuditLogRepository extends MongoRepository<AiActAuditLog, String> {
    List<AiActAuditLog> findBySystemId(String systemId);
    List<AiActAuditLog> findBySystemIdAndOrganizationId(String systemId, String organizationId);
    List<AiActAuditLog> findByUserId(String userId);
}
