package com.zenvyra.repository;

import com.zenvyra.model.AiSystemInventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiSystemInventoryRepository extends MongoRepository<AiSystemInventory, String> {
    List<AiSystemInventory> findByUserId(String userId);

    /**
     * Counts the number of AI systems owned by the given user. Used by
     * onboarding nudges to fire a "first proof pack" email only when the
     * user has exactly one system (i.e. the first one they created).
     */
    long countByUserId(String userId);
}
