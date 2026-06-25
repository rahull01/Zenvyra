package com.zenvyra.repository;

import com.zenvyra.model.UserEngagementSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserEngagementSessionRepository extends MongoRepository<UserEngagementSession, String> {
    Optional<UserEngagementSession> findByUserIdAndSessionId(String userId, String sessionId);
}
