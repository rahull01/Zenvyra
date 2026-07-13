package com.zenvyra.repository;

import com.zenvyra.model.TeamInvite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamInviteRepository extends MongoRepository<TeamInvite, String> {

    List<TeamInvite> findByOrganizationId(String organizationId);

    Optional<TeamInvite> findByToken(String token);

    Optional<TeamInvite> findByOrganizationIdAndEmailAndStatus(
            String organizationId, String email, String status);
}
