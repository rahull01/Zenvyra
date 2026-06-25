package com.zenvyra.repository;

import com.zenvyra.model.Policy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends MongoRepository<Policy, String> {
    List<Policy> findByOrganizationId(String organizationId);
    List<Policy> findByWebsiteId(String websiteId);
    List<Policy> findByTypeAndStatusIgnoreCase(String type, String status);
    Optional<Policy> findTopByCompanySlugAndTypeAndStatusIgnoreCaseOrderByUpdatedAtDesc(
            String companySlug,
            String type,
            String status
    );
}
