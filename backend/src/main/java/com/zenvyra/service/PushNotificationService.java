package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.PushSubscription;
import com.zenvyra.repository.PushSubscriptionRepository;
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

    @Value("${Zenvyra.push.vapid.public:}")
    private String vapidPublicKey;

    @Value("${Zenvyra.push.vapid.private:}")
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

        if (vapidPublicKey == null || vapidPublicKey.isBlank() || vapidPrivateKey == null || vapidPrivateKey.isBlank()) {
            throw ApiException.internalError("Web push VAPID keys are not configured");
        }

        log.info("Sending PUSH notification to {} devices for user {}", subscriptions.size(), userId);

        for (PushSubscription sub : subscriptions) {
            deliverPush(sub, title, message, actionUrl);
        }
    }

    private void deliverPush(PushSubscription sub, String title, String message, String url) {
        throw ApiException.internalError("Web push transport is not configured");
    }

    public void subscribe(String userId, PushSubscription subscription) {
        subscription.setUserId(userId);
        subscriptionRepository.save(subscription);
        log.info("New push subscription registered for user {}", userId);
    }
}
