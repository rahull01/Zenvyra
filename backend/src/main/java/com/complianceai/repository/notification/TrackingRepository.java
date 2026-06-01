package com.complianceai.repository.notification;

import com.complianceai.model.notification.PushTracking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackingRepository extends MongoRepository<PushTracking, String> {
}
