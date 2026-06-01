package com.complianceai.repository;

import com.complianceai.model.PolicyVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyVersionRepository extends MongoRepository<PolicyVersion, String> {
    List<PolicyVersion> findByPolicyIdOrderByVersionDesc(String policyId);
}
