package com.complianceai.repository.notification;

import com.complianceai.model.notification.QueuedNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QueueRepository extends MongoRepository<QueuedNotification, String> {
    List<QueuedNotification> findByProcessedFalseOrderByCreatedAtAsc();
}
