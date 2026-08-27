package com.disputeshield.backend.repository;

import com.disputeshield.backend.domain.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputeRepository extends JpaRepository<Dispute, String> {
}
