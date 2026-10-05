package com.smartaccess.resident_service.domain.repository;

import com.smartaccess.resident_service.domain.model.Resident;

import java.util.List;
import java.util.Optional;

public interface ResidentRepository {

    Resident save(Resident resident);

    Optional<Resident> findById(Long id);

    List<Resident> findAll();

    boolean existsByDocumentNumber(String documentNumber);

    void deleteById(Long id);
}