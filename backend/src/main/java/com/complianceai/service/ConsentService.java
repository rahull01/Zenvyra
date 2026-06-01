package com.complianceai.service;

import com.complianceai.model.ConsentLog;
import com.complianceai.repository.ConsentLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsentService {

    private final ConsentLogRepository consentLogRepository;

    public void logConsent(ConsentLog log) {
        log.setTimestamp(LocalDateTime.now());
        consentLogRepository.save(log);
    }

    public List<ConsentLog> getLogsByBanner(String bannerId) {
        return consentLogRepository.findByBannerId(bannerId);
    }
    
    public long getConsentCount(String bannerId) {
        // In a real app, this would use a more efficient count query
        return consentLogRepository.findByBannerId(bannerId).size();
    }
}
