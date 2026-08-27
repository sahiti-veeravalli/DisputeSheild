package com.disputeshield.backend.repository;

import com.disputeshield.backend.domain.EvaluationDispute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationDisputeRepository extends JpaRepository<EvaluationDispute, String> {
    List<EvaluationDispute> findByIsTrain(boolean isTrain);
}
