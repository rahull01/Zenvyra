package com.zenvyra.repository;

import com.zenvyra.model.OrganizationMember;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationMemberRepository extends MongoRepository<OrganizationMember, String> {

    List<OrganizationMember> findByOrganizationId(String organizationId);

    Optional<OrganizationMember> findByOrganizationIdAndUserId(String organizationId, String userId);

    Optional<OrganizationMember> findByOrganizationIdAndEmail(String organizationId, String email);

    boolean existsByOrganizationIdAndEmail(String organizationId, String email);

    /**
     * Returns the first membership row for the given email, ordered by
     * creation time. Used to resolve the primary organization of an
     * authenticated user in controllers that need the org id.
     */
    Optional<OrganizationMember> findFirstByEmailOrderByCreatedAtAsc(String email);

    java.util.List<OrganizationMember> findByEmail(String email);
}
