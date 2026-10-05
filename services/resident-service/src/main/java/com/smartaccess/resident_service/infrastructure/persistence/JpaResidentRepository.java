package com.smartaccess.resident_service.infrastructure.persistence;

import com.smartaccess.resident_service.domain.model.Resident;
import com.smartaccess.resident_service.domain.repository.ResidentRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class JpaResidentRepository implements ResidentRepository {

    private final SpringDataResidentRepository repository;

    public JpaResidentRepository(SpringDataResidentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Resident save(Resident resident) {
        return repository.save(resident);
    }

    @Override
    public Optional<Resident> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Resident> findAll() {
        return repository.findAll();
    }

    @Override
    public boolean existsByDocumentNumber(String documentNumber) {
        return repository.existsByDocumentNumber(documentNumber);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}