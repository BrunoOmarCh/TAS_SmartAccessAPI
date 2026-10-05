package com.smartaccess.access_service.application.service;

import com.smartaccess.access_service.domain.model.AccessRecord;
import com.smartaccess.access_service.domain.repository.AccessRecordRepository;
import com.smartaccess.access_service.interfaces.rest.dto.CreateAccessRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccessService {

    private final AccessRecordRepository accessRecordRepository;

    public AccessService(
            AccessRecordRepository accessRecordRepository) {

        this.accessRecordRepository = accessRecordRepository;
    }

    public AccessRecord registerAccess(
            CreateAccessRequest request) {

        AccessRecord accessRecord = new AccessRecord(
                request.residentId(),
                request.accessType(),
                request.status(),
                LocalDateTime.now()
        );

        return accessRecordRepository.save(accessRecord);
    }

    public List<AccessRecord> getAll() {

        return accessRecordRepository.findAll();
    }

    public AccessRecord getById(Long id) {

        return accessRecordRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Registro de acceso no encontrado"));
    }

    public List<AccessRecord> getByResidentId(
            Long residentId) {

        return accessRecordRepository
                .findByResidentId(residentId);
    }
}