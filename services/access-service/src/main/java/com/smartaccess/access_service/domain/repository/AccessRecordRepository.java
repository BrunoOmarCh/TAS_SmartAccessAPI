package com.smartaccess.access_service.domain.repository;

import com.smartaccess.access_service.domain.model.AccessRecord;

import java.util.List;
import java.util.Optional;

public interface AccessRecordRepository {

    AccessRecord save(AccessRecord accessRecord);

    Optional<AccessRecord> findById(Long id);

    List<AccessRecord> findAll();

    List<AccessRecord> findByResidentId(Long residentId);
}