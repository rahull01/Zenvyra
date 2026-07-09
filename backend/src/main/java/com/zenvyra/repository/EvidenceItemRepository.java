package com.zenvyra.repository;

import com.zenvyra.model.EvidenceItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceItemRepository extends MongoRepository<EvidenceItem, String> {
    List<EvidenceItem> findBySystemIdAndUserId(String systemId, String userId);
    List<EvidenceItem> findBySystemIdAndOrganizationId(String systemId, String organizationId);
}
