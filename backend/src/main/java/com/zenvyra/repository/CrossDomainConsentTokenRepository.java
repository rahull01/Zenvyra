package com.zenvyra.repository;

import com.zenvyra.model.CrossDomainConsentToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrossDomainConsentTokenRepository extends MongoRepository<CrossDomainConsentToken, String> {
    Optional<CrossDomainConsentToken> findByEnterpriseConsentKeyAndAnonymousUserId(String enterpriseConsentKey, String anonymousUserId);
}
