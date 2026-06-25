package com.zenvyra.controller;

import com.zenvyra.dto.request.CaptureScannerLeadRequest;
import com.zenvyra.service.ScannerLeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/scan")
@RequiredArgsConstructor
public class ScannerLeadController {

    private final ScannerLeadService scannerLeadService;

    @PostMapping("/leads")
    public Map<String, Object> capture(@RequestBody CaptureScannerLeadRequest request) {
        return scannerLeadService.capture(request);
    }
}
