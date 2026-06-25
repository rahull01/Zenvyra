package com.zenvyra.repository;

import com.zenvyra.model.ScannerLead;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScannerLeadRepository extends MongoRepository<ScannerLead, String> {
    Optional<ScannerLead> findByEmailIgnoreCaseAndWebsiteUrl(String email, String websiteUrl);
}
