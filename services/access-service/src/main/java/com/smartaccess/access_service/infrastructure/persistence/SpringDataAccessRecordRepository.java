package com.smartaccess.access_service.infrastructure.persistence;

import com.smartaccess.access_service.domain.model.AccessRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataAccessRecordRepository
        extends JpaRepository<AccessRecord, Long> {

    List<AccessRecord> findByResidentId(Long residentId);
}