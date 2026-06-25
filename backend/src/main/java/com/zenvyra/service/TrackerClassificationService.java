package com.zenvyra.service;

import com.zenvyra.exception.ApiException;
import com.zenvyra.model.TrackerDictionaryEntry;
import com.zenvyra.model.WebsiteScanResult.ClassifiedTracker;
import com.zenvyra.repository.TrackerDictionaryRepository;
import com.zenvyra.util.LogSanitizer;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class TrackerClassificationService {

    private static final String REDIS_TRACKER_DICTIONARY_KEY = "tracker:dictionary";
    private static final String DICTIONARY_RESOURCE = "tracker-dictionary.json";

    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    private final TrackerDictionaryRepository trackerDictionaryRepository;
    private final Map<String, ClassifiedTracker> localDictionary = new ConcurrentHashMap<>();

    @Value("${tracker.classification.mock-enabled:false}")
    private boolean mockEnabled;

    @Value("${tracker.classification.mock-resource:mock-tracker-classification.json}")
    private String mockResource;

    @PostConstruct
    public void initializeDictionary() {
        seedResourceDictionary();
        warmDictionaryFromMongo();
        log.info("Tracker dictionary initialized with {} local entries", localDictionary.size());
    }

    /**
     * Classifies tracking domains through a hybrid route:
     * 1. Redis/local dictionary exact or parent-domain lookup.
     * 2. OpenAI classification only for unknown domains.
     * 3. Mongo + Redis + local cache injection for newly learned entries.
     */
    public List<ClassifiedTracker> classifyDomains(Set<String> domains) {
        if (domains == null || domains.isEmpty()) {
            return new ArrayList<>();
        }

        Map<String, ClassifiedTracker> classifiedByInputDomain = new LinkedHashMap<>();
        Set<String> unrecognizedDomains = new LinkedHashSet<>();

        for (String domain : domains) {
            String normalizedDomain = normalizeDomain(domain);
            if (normalizedDomain == null) {
                continue;
            }

            Optional<ClassifiedTracker> dictionaryHit = findInDictionary(normalizedDomain);
            if (dictionaryHit.isPresent()) {
                ClassifiedTracker tracker = copyForDomain(dictionaryHit.get(), normalizedDomain);
                classifiedByInputDomain.put(normalizedDomain, tracker);
            } else {
                unrecognizedDomains.add(normalizedDomain);
            }
        }

        if (!unrecognizedDomains.isEmpty()) {
            List<ClassifiedTracker> learnedTrackers = classifyUnknownDomains(unrecognizedDomains);
            learnedTrackers.forEach(tracker -> {
                String normalizedDomain = normalizeDomain(tracker.getDomain());
                if (normalizedDomain != null) {
                    tracker.setDomain(normalizedDomain);
                    saveLearnedTracker(tracker);
                    classifiedByInputDomain.put(normalizedDomain, tracker);
                }
            });
        }

        return new ArrayList<>(classifiedByInputDomain.values());
    }

    private void seedResourceDictionary() {
        try (InputStream inputStream = new ClassPathResource(DICTIONARY_RESOURCE).getInputStream()) {
            List<ClassifiedTracker> seedEntries = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<ClassifiedTracker>>() {}
            );

            for (ClassifiedTracker tracker : seedEntries) {
                String domain = normalizeDomain(tracker.getDomain());
                if (domain == null) {
                    continue;
                }
                tracker.setDomain(domain);
                localDictionary.put(domain, tracker);
                saveToRedis(domain, tracker);
            }
            log.info("Seeded {} tracker dictionary entries from {}", seedEntries.size(), DICTIONARY_RESOURCE);
        } catch (Exception e) {
            log.warn("Unable to seed tracker dictionary from {}: {}", DICTIONARY_RESOURCE, LogSanitizer.exception(e));
        }
    }

    private void warmDictionaryFromMongo() {
        try {
            trackerDictionaryRepository.findAll().forEach(entry -> {
                ClassifiedTracker tracker = toClassifiedTracker(entry);
                String domain = normalizeDomain(tracker.getDomain());
                if (domain != null) {
                    tracker.setDomain(domain);
                    localDictionary.put(domain, tracker);
                    saveToRedis(domain, tracker);
                }
            });
        } catch (Exception e) {
            log.warn("Unable to warm tracker dictionary from MongoDB: {}", LogSanitizer.exception(e));
        }
    }

    private Optional<ClassifiedTracker> findInDictionary(String domain) {
        for (String candidate : domainCandidates(domain)) {
            Optional<ClassifiedTracker> redisHit = findInRedis(candidate);
            if (redisHit.isPresent()) {
                localDictionary.putIfAbsent(candidate, redisHit.get());
                return redisHit;
            }

            ClassifiedTracker localHit = localDictionary.get(candidate);
            if (localHit != null) {
                return Optional.of(localHit);
            }
        }
        return Optional.empty();
    }

    private Optional<ClassifiedTracker> findInRedis(String domain) {
        try {
            Object value = redisTemplate.opsForHash().get(REDIS_TRACKER_DICTIONARY_KEY, domain);
            if (value == null) {
                return Optional.empty();
            }
            return Optional.of(objectMapper.convertValue(value, ClassifiedTracker.class));
        } catch (IllegalArgumentException | DataAccessException e) {
            log.debug("Redis tracker dictionary lookup failed for {}: {}", LogSanitizer.id("domain", domain), LogSanitizer.exception(e));
            return Optional.empty();
        }
    }

    private List<ClassifiedTracker> classifyUnknownDomains(Set<String> unrecognizedDomains) {
        if (mockEnabled) {
            return classifyUnknownDomainsFromMock(unrecognizedDomains);
        }

        try {
            String domainsJson = objectMapper.writeValueAsString(unrecognizedDomains);
            String responseRaw = openAiService.classifyTrackingDomains(domainsJson);
            String cleanJson = cleanOpenAiJson(responseRaw);

            List<ClassifiedTracker> classified = objectMapper.readValue(
                    cleanJson,
                    new TypeReference<List<ClassifiedTracker>>() {}
            );

            if (classified.size() != unrecognizedDomains.size()) {
                log.warn("OpenAI classified {} of {} unknown tracking domains", classified.size(), unrecognizedDomains.size());
            }
            log.info("OpenAI classified {} previously unknown tracking domains", classified.size());
            return classified;
        } catch (Exception e) {
            log.error("Failed to classify unknown tracking domains with OpenAI: {}", LogSanitizer.exception(e));
            throw ApiException.internalError("Tracker classification failed. Configure OpenAI and retry.");
        }
    }

    private List<ClassifiedTracker> classifyUnknownDomainsFromMock(Set<String> unrecognizedDomains) {
        try (InputStream inputStream = new ClassPathResource(mockResource).getInputStream()) {
            List<ClassifiedTracker> mockEntries = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<ClassifiedTracker>>() {}
            );
            Map<String, ClassifiedTracker> byDomain = new LinkedHashMap<>();
            for (ClassifiedTracker tracker : mockEntries) {
                String domain = normalizeDomain(tracker.getDomain());
                if (domain != null) {
                    byDomain.put(domain, tracker);
                }
            }

            return unrecognizedDomains.stream()
                    .map(domain -> copyForDomain(
                            byDomain.getOrDefault(domain, ClassifiedTracker.builder()
                                    .domain(domain)
                                    .serviceName("Mock Tracker")
                                    .category("Analytics")
                                    .purposeDescription("Local test tracker classification response.")
                                    .build()),
                            domain))
                    .toList();
        } catch (Exception e) {
            log.error("Failed to load mock tracker classification resource {}: {}", mockResource, LogSanitizer.exception(e));
            throw ApiException.internalError("Mock tracker classification failed.");
        }
    }

    private void saveLearnedTracker(ClassifiedTracker tracker) {
        String domain = normalizeDomain(tracker.getDomain());
        if (domain == null) {
            return;
        }

        tracker.setDomain(domain);
        localDictionary.put(domain, tracker);
        saveToRedis(domain, tracker);

        TrackerDictionaryEntry entry = trackerDictionaryRepository.findByDomain(domain)
                .map(existing -> {
                    existing.setServiceName(tracker.getServiceName());
                    existing.setCategory(tracker.getCategory());
                    existing.setPurposeDescription(tracker.getPurposeDescription());
                    existing.setSource("openai");
                    existing.setUpdatedAt(LocalDateTime.now());
                    return existing;
                })
                .orElseGet(() -> toDictionaryEntry(tracker, "openai"));
        trackerDictionaryRepository.save(entry);
    }

    private void saveToRedis(String domain, ClassifiedTracker tracker) {
        try {
            redisTemplate.opsForHash().put(REDIS_TRACKER_DICTIONARY_KEY, domain, tracker);
        } catch (DataAccessException e) {
            log.debug("Redis tracker dictionary write failed for {}: {}", LogSanitizer.id("domain", domain), LogSanitizer.exception(e));
        }
    }

    private TrackerDictionaryEntry toDictionaryEntry(ClassifiedTracker tracker, String source) {
        LocalDateTime now = LocalDateTime.now();
        return TrackerDictionaryEntry.builder()
                .domain(normalizeDomain(tracker.getDomain()))
                .serviceName(valueOr(tracker.getServiceName(), "Unknown tracker"))
                .category(valueOr(tracker.getCategory(), "Functional"))
                .purposeDescription(valueOr(tracker.getPurposeDescription(), "Used by the website to provide third-party functionality."))
                .source(source)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    private ClassifiedTracker toClassifiedTracker(TrackerDictionaryEntry entry) {
        return ClassifiedTracker.builder()
                .domain(entry.getDomain())
                .serviceName(entry.getServiceName())
                .category(entry.getCategory())
                .purposeDescription(entry.getPurposeDescription())
                .build();
    }

    private ClassifiedTracker copyForDomain(ClassifiedTracker tracker, String domain) {
        return ClassifiedTracker.builder()
                .domain(domain)
                .serviceName(tracker.getServiceName())
                .category(tracker.getCategory())
                .purposeDescription(tracker.getPurposeDescription())
                .build();
    }

    private List<String> domainCandidates(String domain) {
        String normalized = normalizeDomain(domain);
        if (normalized == null) {
            return List.of();
        }
        String[] labels = normalized.split("\\.");
        List<String> candidates = new ArrayList<>();
        for (int i = 0; i <= labels.length - 2; i++) {
            candidates.add(String.join(".", java.util.Arrays.copyOfRange(labels, i, labels.length)));
        }
        return candidates.stream()
                .filter(value -> !value.isBlank())
                .distinct()
                .sorted(Comparator.comparingInt(String::length).reversed())
                .toList();
    }

    private String cleanOpenAiJson(String responseRaw) {
        String cleanJson = responseRaw == null ? "" : responseRaw.trim();
        if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.replaceAll("^```json\\s*", "").replaceAll("^```\\s*", "").replaceAll("```$", "").trim();
        }
        return cleanJson;
    }

    private String normalizeDomain(String domain) {
        if (domain == null || domain.isBlank()) {
            return null;
        }
        String normalized = domain.trim().toLowerCase(Locale.ROOT);
        normalized = normalized.replaceFirst("^https?://", "");
        normalized = normalized.replaceFirst("^//", "");
        normalized = normalized.split("[/?#]")[0];
        normalized = normalized.replaceFirst("^www\\.", "");
        normalized = normalized.replaceAll("\\.$", "");
        return normalized.isBlank() ? null : normalized;
    }

    private String valueOr(String value, String replacement) {
        return Objects.toString(value, "").isBlank() ? replacement : value;
    }
}
