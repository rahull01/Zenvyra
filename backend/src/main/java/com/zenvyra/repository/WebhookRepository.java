package com.zenvyra.repository;

import com.zenvyra.model.Webhook;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookRepository extends MongoRepository<Webhook, String> {
    List<Webhook> findByOrganizationIdAndActiveTrue(String organizationId);
}
