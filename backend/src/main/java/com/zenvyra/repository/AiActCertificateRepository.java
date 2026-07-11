package com.zenvyra.repository;

import com.zenvyra.model.AiActCertificate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiActCertificateRepository extends MongoRepository<AiActCertificate, String> {

    Optional<AiActCertificate> findByVerificationToken(String token);

    Optional<AiActCertificate> findBySystemIdAndActiveTrue(String systemId);

    List<AiActCertificate> findBySystemIdOrderByIssuedAtDesc(String systemId);
}
