package com.zenvyra.repository;

import com.zenvyra.model.UserExperienceFlag;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserExperienceFlagRepository extends MongoRepository<UserExperienceFlag, String> {
}
