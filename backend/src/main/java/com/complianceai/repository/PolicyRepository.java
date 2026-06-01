package com.complianceai.repository;

import com.complianceai.model.Policy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyRepository extends MongoRepository<Policy, String> {
    List<Policy> findByOrganizationId(String organizationId);
}
