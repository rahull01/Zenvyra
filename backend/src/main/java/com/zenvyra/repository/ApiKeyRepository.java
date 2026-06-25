package com.zenvyra.repository;

import com.zenvyra.model.ApiKey;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends MongoRepository<ApiKey, String> {
    Optional<ApiKey> findByKeyHashAndRevokedAtIsNull(String keyHash);
    List<ApiKey> findByUserIdAndRevokedAtIsNullOrderByCreatedAtDesc(String userId);
}
