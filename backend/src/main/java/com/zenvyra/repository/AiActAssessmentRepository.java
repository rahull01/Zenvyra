package com.zenvyra.repository;

import com.zenvyra.model.AiActAssessment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiActAssessmentRepository extends MongoRepository<AiActAssessment, String> {
    List<AiActAssessment> findByUserId(String userId);
    List<AiActAssessment> findBySystemId(String systemId);
}
