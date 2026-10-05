package com.smartaccess.access_service.interfaces.rest.dto;

import com.smartaccess.access_service.domain.model.AccessRecord;
import com.smartaccess.access_service.domain.model.AccessStatus;
import com.smartaccess.access_service.domain.model.AccessType;

import java.time.LocalDateTime;

public record AccessResponse(
        Long id,
        Long residentId,
        AccessType accessType,
        AccessStatus status,
        LocalDateTime accessDate
) {

    public static AccessResponse fromDomain(
            AccessRecord accessRecord) {

        return new AccessResponse(
                accessRecord.getId(),
                accessRecord.getResidentId(),
                accessRecord.getAccessType(),
                accessRecord.getStatus(),
                accessRecord.getAccessDate()
        );
    }
}