package com.disputeshield.backend.repository;

import com.disputeshield.backend.domain.AuditEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditEntryRepository extends JpaRepository<AuditEntryEntity, Long> {
    List<AuditEntryEntity> findByDisputeIdOrderByIdAsc(String disputeId);
    boolean existsByDisputeIdAndLabel(String disputeId, String label);
}
