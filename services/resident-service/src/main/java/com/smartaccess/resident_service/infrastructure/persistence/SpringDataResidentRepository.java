package com.smartaccess.resident_service.infrastructure.persistence;

import com.smartaccess.resident_service.domain.model.Resident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataResidentRepository
        extends JpaRepository<Resident, Long> {

    boolean existsByDocumentNumber(String documentNumber);
} 