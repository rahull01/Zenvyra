package com.zenvyra.repository;

import com.zenvyra.model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    Optional<Subscription> findByUserId(String userId);
    Optional<Subscription> findByDodoSubscriptionId(String dodoSubscriptionId);
    List<Subscription> findByStatusIgnoreCase(String status);
}
