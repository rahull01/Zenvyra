package com.zenvyra.controller;

import com.zenvyra.dto.request.CreateEvidenceItemRequest;
import com.zenvyra.dto.request.UpdateEvidenceItemRequest;
import com.zenvyra.dto.request.UpdateEvidenceStatusRequest;
import com.zenvyra.dto.response.EvidenceItemResponse;
import com.zenvyra.service.EvidenceItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ai-act/evidence")
@RequiredArgsConstructor
public class AiActEvidenceController {

    private final EvidenceItemService service;

    @PostMapping
    public ResponseEntity<EvidenceItemResponse> create(@AuthenticationPrincipal UserDetails userDetails,
                                                       @Valid @RequestBody CreateEvidenceItemRequest request) {
        EvidenceItemResponse response = service.create(userDetails, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/system/{systemId}")
    public List<EvidenceItemResponse> listBySystem(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable String systemId) {
        return service.findBySystem(userDetails, systemId);
    }

    @GetMapping("/{id}")
    public EvidenceItemResponse get(@AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable String id) {
        return service.findById(userDetails, id);
    }

    @PutMapping("/{id}")
    public EvidenceItemResponse update(@AuthenticationPrincipal UserDetails userDetails,
                                       @PathVariable String id,
                                       @Valid @RequestBody UpdateEvidenceItemRequest request) {
        return service.update(userDetails, id, request);
    }

    @PutMapping("/{id}/status")
    public EvidenceItemResponse updateStatus(@AuthenticationPrincipal UserDetails userDetails,
                                             @PathVariable String id,
                                             @Valid @RequestBody UpdateEvidenceStatusRequest request) {
        return service.updateStatus(userDetails, id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails userDetails,
                                       @PathVariable String id) {
        service.delete(userDetails, id);
        return ResponseEntity.noContent().build();
    }
}
