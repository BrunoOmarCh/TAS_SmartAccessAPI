package com.smartaccess.resident_service.interfaces.rest;

import com.smartaccess.resident_service.application.service.ResidentService;
import com.smartaccess.resident_service.domain.model.Resident;
import com.smartaccess.resident_service.interfaces.rest.dto.CreateResidentRequest;
import com.smartaccess.resident_service.interfaces.rest.dto.ResidentResponse;
import com.smartaccess.resident_service.interfaces.rest.dto.UpdateResidentRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residents")
public class ResidentController {

    private final ResidentService residentService;

    public ResidentController(ResidentService residentService) {
        this.residentService = residentService;
    }

    @PostMapping
    public ResponseEntity<ResidentResponse> create(
            @Valid @RequestBody CreateResidentRequest request) {

        Resident resident = residentService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ResidentResponse.fromDomain(resident));
    }

    @GetMapping
    public ResponseEntity<List<ResidentResponse>> getAll() {

        List<ResidentResponse> response =
                residentService.getAll()
                        .stream()
                        .map(ResidentResponse::fromDomain)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResidentResponse> getById(
            @PathVariable Long id) {

        Resident resident = residentService.getById(id);

        return ResponseEntity.ok(
                ResidentResponse.fromDomain(resident));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResidentResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateResidentRequest request) {

        Resident resident =
                residentService.update(id, request);

        return ResponseEntity.ok(
                ResidentResponse.fromDomain(resident));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        residentService.delete(id);

        return ResponseEntity.noContent().build();
    }
}