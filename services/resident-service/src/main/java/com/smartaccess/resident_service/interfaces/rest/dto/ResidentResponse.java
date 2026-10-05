package com.smartaccess.resident_service.interfaces.rest.dto;

import com.smartaccess.resident_service.domain.model.Resident;
import com.smartaccess.resident_service.domain.model.ResidentStatus;

public record ResidentResponse(
        Long id,
        String name,
        String documentNumber,
        String apartment,
        String email,
        ResidentStatus status
) {

    public static ResidentResponse fromDomain(Resident resident) {

        return new ResidentResponse(
                resident.getId(),
                resident.getName(),
                resident.getDocumentNumber(),
                resident.getApartment(),
                resident.getEmail(),
                resident.getStatus()
        );
    }
}