package com.complianceai.repository;

import com.complianceai.model.ComplianceCertificate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends MongoRepository<ComplianceCertificate, String> {
    List<ComplianceCertificate> findByUserId(String userId);
    Optional<ComplianceCertificate> findByWebsiteIdAndActiveTrue(String websiteId);
    Optional<ComplianceCertificate> findByVerificationToken(String token);
    List<ComplianceCertificate> findByUserIdAndActiveTrue(String userId);
}
