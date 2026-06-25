package com.zenvyra.controller;

import com.zenvyra.model.PushSubscription;
import com.zenvyra.service.PushNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/push")
@RequiredArgsConstructor
public class PushSubscriptionController {

    private final PushNotificationService pushService;

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PushSubscription subscription) {
        
        pushService.subscribe(userDetails.getUsername(), subscription);
        return ResponseEntity.ok().build();
    }
}
