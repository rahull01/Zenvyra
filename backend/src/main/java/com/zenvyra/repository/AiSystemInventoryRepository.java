package com.zenvyra.repository;

import com.zenvyra.model.AiSystemInventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiSystemInventoryRepository extends MongoRepository<AiSystemInventory, String> {
    List<AiSystemInventory> findByUserId(String userId);
}
