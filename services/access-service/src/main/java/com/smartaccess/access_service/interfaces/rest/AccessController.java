package com.smartaccess.access_service.interfaces.rest;

import com.smartaccess.access_service.application.service.AccessService;
import com.smartaccess.access_service.domain.model.AccessRecord;
import com.smartaccess.access_service.interfaces.rest.dto.AccessResponse;
import com.smartaccess.access_service.interfaces.rest.dto.CreateAccessRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/access")
public class AccessController {

    private final AccessService accessService;

    public AccessController(AccessService accessService) {
        this.accessService = accessService;
    }

    @PostMapping
    public ResponseEntity<AccessResponse> registerAccess(
            @Valid @RequestBody CreateAccessRequest request) {

        AccessRecord accessRecord =
                accessService.registerAccess(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(AccessResponse.fromDomain(accessRecord));
    }

    @GetMapping
    public ResponseEntity<List<AccessResponse>> getAll() {

        List<AccessResponse> response =
                accessService.getAll()
                        .stream()
                        .map(AccessResponse::fromDomain)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccessResponse> getById(
            @PathVariable Long id) {

        AccessRecord accessRecord =
                accessService.getById(id);

        return ResponseEntity.ok(
                AccessResponse.fromDomain(accessRecord));
    }

    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<AccessResponse>>
    getByResidentId(
            @PathVariable Long residentId) {

        List<AccessResponse> response =
                accessService
                        .getByResidentId(residentId)
                        .stream()
                        .map(AccessResponse::fromDomain)
                        .toList();

        return ResponseEntity.ok(response);
    }
}