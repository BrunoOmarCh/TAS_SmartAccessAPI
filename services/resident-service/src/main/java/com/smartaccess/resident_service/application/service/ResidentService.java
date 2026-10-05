package com.smartaccess.resident_service.application.service;

import com.smartaccess.resident_service.domain.model.Resident;
import com.smartaccess.resident_service.domain.model.ResidentStatus;
import com.smartaccess.resident_service.domain.repository.ResidentRepository;
import com.smartaccess.resident_service.interfaces.rest.dto.CreateResidentRequest;
import com.smartaccess.resident_service.interfaces.rest.dto.UpdateResidentRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResidentService {

    private final ResidentRepository residentRepository;

    public ResidentService(ResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    public Resident create(CreateResidentRequest request) {

        if (residentRepository.existsByDocumentNumber(
                request.documentNumber())) {

            throw new IllegalArgumentException(
                    "Ya existe un residente con ese número de documento");
        }

        Resident resident = new Resident(
                request.name(),
                request.documentNumber(),
                request.apartment(),
                request.email(),
                ResidentStatus.ACTIVE
        );

        return residentRepository.save(resident);
    }

    public Resident getById(Long id) {

        return residentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Residente no encontrado"));
    }

    public List<Resident> getAll() {
        return residentRepository.findAll();
    }

    public Resident update(
            Long id,
            UpdateResidentRequest request) {

        Resident resident = getById(id);

        resident.setName(request.name());
        resident.setApartment(request.apartment());
        resident.setEmail(request.email());

        return residentRepository.save(resident);
    }

    public void delete(Long id) {

        getById(id);

        residentRepository.deleteById(id);
    }
}