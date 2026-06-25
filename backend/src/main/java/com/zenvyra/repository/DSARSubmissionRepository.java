package com.zenvyra.repository;

import com.zenvyra.model.DSARSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DSARSubmissionRepository extends MongoRepository<DSARSubmission, String> {
    List<DSARSubmission> findByFormId(String formId);
    List<DSARSubmission> findByEmail(String email);
}
