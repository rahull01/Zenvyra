package com.zenvyra.repository;

import com.zenvyra.model.DSARForm;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DSARFormRepository extends MongoRepository<DSARForm, String> {
}
