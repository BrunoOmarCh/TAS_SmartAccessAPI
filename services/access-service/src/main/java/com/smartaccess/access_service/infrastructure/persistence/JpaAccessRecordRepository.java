package com.smartaccess.access_service.infrastructure.persistence;

import com.smartaccess.access_service.domain.model.AccessRecord;
import com.smartaccess.access_service.domain.repository.AccessRecordRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class JpaAccessRecordRepository
        implements AccessRecordRepository {

    private final SpringDataAccessRecordRepository repository;

    public JpaAccessRecordRepository(
            SpringDataAccessRecordRepository repository) {

        this.repository = repository;
    }

    @Override
    public AccessRecord save(AccessRecord accessRecord) {
        return repository.save(accessRecord);
    }

    @Override
    public Optional<AccessRecord> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<AccessRecord> findAll() {
        return repository.findAll();
    }

    @Override
    public List<AccessRecord> findByResidentId(Long residentId) {
        return repository.findByResidentId(residentId);
    }
}