package com.zenvyra.controller;

import com.zenvyra.dto.request.CreateSetupPackageRequest;
import com.zenvyra.dto.response.SetupPackageResponse;
import com.zenvyra.model.SetupPackageOrder;
import com.zenvyra.service.SetupPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/setup-package")
@RequiredArgsConstructor
public class SetupPackageController {

    private final SetupPackageService setupPackageService;

    @GetMapping("/status")
    public ResponseEntity<List<SetupPackageOrder>> status(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(setupPackageService.getOrdersForUser(userDetails.getUsername()));
    }

    @PostMapping("/request")
    public ResponseEntity<SetupPackageResponse> requestSetup(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateSetupPackageRequest request) {
        return ResponseEntity.ok(setupPackageService.requestSetup(userDetails.getUsername(), request));
    }
}
