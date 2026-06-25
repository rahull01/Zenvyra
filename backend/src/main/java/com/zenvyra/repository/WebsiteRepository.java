package com.zenvyra.repository;

import com.zenvyra.model.Website;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebsiteRepository extends MongoRepository<Website, String> {

    List<Website> findByUserId(String userId);

    Optional<Website> findByUserIdAndUrl(String userId, String url);

    List<Website> findByMonitoringEnabledTrue();

    long countByUserId(String userId);
}
