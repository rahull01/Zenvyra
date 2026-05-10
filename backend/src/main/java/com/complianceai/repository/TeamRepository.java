package com.complianceai.repository;

import com.complianceai.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {

    List<Team> findByOwnerId(String ownerId);

    List<Team> findByOwnerIdOrMembersUserId(String ownerId, String memberId);
}
