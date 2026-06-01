package com.complianceai.repository;

import com.complianceai.model.PushSubscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PushSubscriptionRepository extends MongoRepository<PushSubscription, String> {
    List<PushSubscription> findByUserId(String userId);
    void deleteByEndpoint(String endpoint);
}
