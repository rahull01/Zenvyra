package com.complianceai.repository.notification;

import com.complianceai.model.notification.NotificationPreference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferenceRepository extends MongoRepository<NotificationPreference, String> {
}
