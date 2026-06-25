package com.zenvyra.repository.notification;

import com.zenvyra.model.notification.NotificationPreference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferenceRepository extends MongoRepository<NotificationPreference, String> {
}
