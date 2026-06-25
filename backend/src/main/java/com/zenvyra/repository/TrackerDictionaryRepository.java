package com.zenvyra.repository;

import com.zenvyra.model.TrackerDictionaryEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrackerDictionaryRepository extends MongoRepository<TrackerDictionaryEntry, String> {
    Optional<TrackerDictionaryEntry> findByDomain(String domain);
    List<TrackerDictionaryEntry> findByDomainIn(Collection<String> domains);
}
