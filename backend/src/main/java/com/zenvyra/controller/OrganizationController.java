package com.zenvyra.controller;

import com.zenvyra.model.Organization;
import com.zenvyra.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<Organization> getOrganization(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(organizationService.getOrganizationByOwner(userDetails.getUsername()));
    }

    @PutMapping
    public ResponseEntity<Organization> updateOrganization(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Organization organization) {
        return ResponseEntity.ok(organizationService.updateOrganization(userDetails.getUsername(), organization));
    }
}
