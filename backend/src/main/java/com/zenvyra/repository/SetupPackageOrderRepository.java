package com.zenvyra.repository;

import com.zenvyra.model.SetupPackageOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SetupPackageOrderRepository extends MongoRepository<SetupPackageOrder, String> {
    List<SetupPackageOrder> findByUserIdOrderByRequestedAtDesc(String userId);
    List<SetupPackageOrder> findByWebsiteIdOrderByRequestedAtDesc(String websiteId);
    Optional<SetupPackageOrder> findFirstByUserIdOrderByRequestedAtDesc(String userId);
}
