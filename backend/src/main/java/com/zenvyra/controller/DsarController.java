package com.zenvyra.controller;

import com.zenvyra.model.DSARSubmission;
import com.zenvyra.service.DsarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dsar")
@RequiredArgsConstructor
public class DsarController {

    private final DsarService dsarService;

    @PostMapping("/submit")
    public ResponseEntity<DSARSubmission> submitRequest(@RequestBody DSARSubmission submission) {
        return ResponseEntity.ok(dsarService.submitRequest(submission));
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<DSARSubmission>> getAllSubmissions() {
        return ResponseEntity.ok(dsarService.getAllSubmissions());
    }

    @GetMapping("/submissions/form/{formId}")
    public ResponseEntity<List<DSARSubmission>> getSubmissionsByForm(@PathVariable String formId) {
        return ResponseEntity.ok(dsarService.getSubmissionsByForm(formId));
    }

    @PatchMapping("/submissions/{id}/status")
    public ResponseEntity<DSARSubmission> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {
        return dsarService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
