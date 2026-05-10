package com.complianceai.repository;

import com.complianceai.model.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends MongoRepository<Alert, String> {

    List<Alert> findByUserId(String userId);

    List<Alert> findByUserIdAndReadFalse(String userId);

    List<Alert> findByUserIdAndSeverity(String userId, String severity);

    long countByUserIdAndReadFalse(String userId);
}
