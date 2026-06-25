package com.zenvyra.repository;

import com.zenvyra.model.Competitor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetitorRepository extends MongoRepository<Competitor, String> {

    List<Competitor> findByUserId(String userId);

    List<Competitor> findByUserIdOrderByComplianceScoreDesc(String userId);
}
