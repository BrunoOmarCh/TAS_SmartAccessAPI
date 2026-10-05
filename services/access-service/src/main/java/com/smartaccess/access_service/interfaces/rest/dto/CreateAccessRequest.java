package com.smartaccess.access_service.interfaces.rest.dto;

import com.smartaccess.access_service.domain.model.AccessType;
import jakarta.validation.constraints.NotNull;

public record CreateAccessRequest(

        @NotNull(message = "El residentId es obligatorio")
        Long residentId,

        @NotNull(message = "El tipo de acceso es obligatorio")
        AccessType accessType,

        @NotNull(message = "El estado del acceso es obligatorio")
        com.smartaccess.access_service.domain.model.AccessStatus status
) {
}