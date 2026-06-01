package com.complianceai.service;

import com.complianceai.model.PushSubscription;
import com.complianceai.repository.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PushNotificationService {

    private final PushSubscriptionRepository subscriptionRepository;

    @Value("${complianceai.push.vapid.public:}")
    private String vapidPublicKey;

    @Value("${complianceai.push.vapid.private:}")
    private String vapidPrivateKey;

    /**
     * Sends a push notification to all devices subscribed by the user.
     */
    public void sendPush(String userId, String title, String message, String actionUrl) {
        List<PushSubscription> subscriptions = subscriptionRepository.findByUserId(userId);
        
        if (subscriptions.isEmpty()) {
            log.info("No push subscriptions found for user {}", userId);
            return;
        }

        log.info("Sending PUSH notification to {} devices for user {}", subscriptions.size(), userId);
        
        // Logic for sending via web-push library
        // Payload would look like: { "title": "...", "body": "...", "icon": "...", "data": { "url": "..." } }
        for (PushSubscription sub : subscriptions) {
            simulatePushExecution(sub, title, message, actionUrl);
        }
    }

    private void simulatePushExecution(PushSubscription sub, String title, String message, String url) {
        // In a real implementation, we would use:
        // Notification n = new Notification(sub.getEndpoint(), sub.getP256dh(), sub.getAuth(), payload);
        // pushService.send(n);
        log.info("PUSH [Real-time] to {}: {} - {} (Target: {})", 
            sub.getEndpoint().substring(0, Math.min(20, sub.getEndpoint().length())), 
            title, message, url);
    }

    public void subscribe(String userId, PushSubscription subscription) {
        subscription.setUserId(userId);
        subscriptionRepository.save(subscription);
        log.info("New push subscription registered for user {}", userId);
    }
}
