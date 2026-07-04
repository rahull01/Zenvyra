package com.zenvyra.service;

import com.zenvyra.util.LogSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiCostAlertService {

    private final EmailService emailService;

    @Value("${openai.cost-alert.threshold-usd:50.0}")
    private double thresholdUsd;

    @Value("${openai.cost-alert.recipient:}")
    private String alertRecipient;

    private final AtomicReference<LocalDate> currentDay = new AtomicReference<>(LocalDate.now());
    private final AtomicBoolean alertSentToday = new AtomicBoolean(false);
    private double dailySpendUsd = 0.0;

    /**
     * Records estimated OpenAI API spend for the current call and triggers an admin alert
     * if the daily threshold is exceeded. The estimate is intentionally conservative:
     * it uses max output tokens and average input-to-output ratios because OpenAI's
     * response headers may not always be present.
     */
    public synchronized void recordUsage(String model, int promptTokens, int completionTokens) {
        LocalDate today = LocalDate.now();
        if (!today.equals(currentDay.get())) {
            currentDay.set(today);
            dailySpendUsd = 0.0;
            alertSentToday.set(false);
        }

        double cost = estimateCostUsd(model, promptTokens, completionTokens);
        dailySpendUsd += cost;

        log.debug("OpenAI usage recorded: model={}, promptTokens={}, completionTokens={}, cost=${}, dailySpend=${}",
                model, promptTokens, completionTokens, String.format("%.6f", cost), String.format("%.4f", dailySpendUsd));

        if (dailySpendUsd >= thresholdUsd && alertSentToday.compareAndSet(false, true)) {
            sendAlert();
        }
    }

    public synchronized double getDailySpendUsd() {
        return dailySpendUsd;
    }

    private double estimateCostUsd(String model, int promptTokens, int completionTokens) {
        if (model == null) {
            model = "";
        }
        String lower = model.toLowerCase();
        double promptRate;
        double completionRate;

        if (lower.contains("gpt-4o")) {
            promptRate = 2.50 / 1_000_000.0;
            completionRate = 10.00 / 1_000_000.0;
        } else if (lower.contains("gpt-4")) {
            promptRate = 30.00 / 1_000_000.0;
            completionRate = 60.00 / 1_000_000.0;
        } else if (lower.contains("gpt-3.5") || lower.contains("gpt-3.5-turbo")) {
            promptRate = 0.50 / 1_000_000.0;
            completionRate = 1.50 / 1_000_000.0;
        } else {
            // Conservative default for unknown models
            promptRate = 5.00 / 1_000_000.0;
            completionRate = 15.00 / 1_000_000.0;
        }

        return (promptTokens * promptRate) + (completionTokens * completionRate);
    }

    private void sendAlert() {
        if (alertRecipient == null || alertRecipient.isBlank()) {
            log.warn("OpenAI daily cost threshold exceeded (${}) but no alert recipient is configured. Set openai.cost-alert.recipient.",
                    String.format("%.2f", thresholdUsd));
            return;
        }
        try {
            emailService.sendOpenAiCostAlertEmail(alertRecipient, dailySpendUsd, thresholdUsd);
            log.info("OpenAI cost alert sent to {}", LogSanitizer.email(alertRecipient));
        } catch (Exception e) {
            log.error("Failed to send OpenAI cost alert: {}", LogSanitizer.exception(e));
        }
    }
}
