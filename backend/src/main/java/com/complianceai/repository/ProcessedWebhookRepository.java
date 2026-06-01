package com.complianceai.repository;

import com.complianceai.model.ProcessedWebhook;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProcessedWebhookRepository extends MongoRepository<ProcessedWebhook, String> {
}
