package com.zenvyra.repository;

import com.zenvyra.model.ProcessedWebhook;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProcessedWebhookRepository extends MongoRepository<ProcessedWebhook, String> {
}
