package com.smartaccess.access_service.domain.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "access_records")
public class AccessRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resident_id", nullable = false)
    private Long residentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_type", nullable = false)
    private AccessType accessType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessStatus status;

    @Column(name = "access_date", nullable = false)
    private LocalDateTime accessDate;

    public AccessRecord() {
    }

    public AccessRecord(
            Long residentId,
            AccessType accessType,
            AccessStatus status,
            LocalDateTime accessDate) {

        this.residentId = residentId;
        this.accessType = accessType;
        this.status = status;
        this.accessDate = accessDate;
    }

    public Long getId() {
        return id;
    }

    public Long getResidentId() {
        return residentId;
    }

    public AccessType getAccessType() {
        return accessType;
    }

    public AccessStatus getStatus() {
        return status;
    }

    public LocalDateTime getAccessDate() {
        return accessDate;
    }

    public void setStatus(AccessStatus status) {
        this.status = status;
    }
}