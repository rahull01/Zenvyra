package com.zenvyra.repository.notification;

import com.zenvyra.model.notification.PushTracking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackingRepository extends MongoRepository<PushTracking, String> {
}
