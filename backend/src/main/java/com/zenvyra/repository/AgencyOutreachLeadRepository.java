package com.zenvyra.repository;

import com.zenvyra.model.AgencyOutreachLead;
import com.zenvyra.model.AgencyOutreachLead.OutreachStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgencyOutreachLeadRepository extends MongoRepository<AgencyOutreachLead, String> {
    List<AgencyOutreachLead> findTop25ByStatusOrderByCreatedAtAsc(OutreachStatus status);
}
