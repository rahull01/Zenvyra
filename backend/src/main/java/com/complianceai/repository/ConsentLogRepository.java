package com.complianceai.repository;

import com.complianceai.model.ConsentLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsentLogRepository extends MongoRepository<ConsentLog, String> {
    List<ConsentLog> findByBannerId(String bannerId);
}
