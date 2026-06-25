package com.zenvyra.repository;

import com.zenvyra.model.WebhookDelivery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WebhookDeliveryRepository extends MongoRepository<WebhookDelivery, String> {
}
