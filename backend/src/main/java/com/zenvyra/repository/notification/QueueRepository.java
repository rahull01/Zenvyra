package com.zenvyra.repository.notification;

import com.zenvyra.model.notification.QueuedNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QueueRepository extends MongoRepository<QueuedNotification, String> {
    List<QueuedNotification> findByProcessedFalseOrderByCreatedAtAsc();
}
