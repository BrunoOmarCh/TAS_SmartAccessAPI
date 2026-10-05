package com.smartaccess.resident_service.domain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "residents")
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "document_number", nullable = false, unique = true)
    private String documentNumber;

    @Column(nullable = false)
    private String apartment;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResidentStatus status;

    public Resident() {
    }

    public Resident(
            String name,
            String documentNumber,
            String apartment,
            String email,
            ResidentStatus status) {

        this.name = name;
        this.documentNumber = documentNumber;
        this.apartment = apartment;
        this.email = email;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public String getApartment() {
        return apartment;
    }

    public String getEmail() {
        return email;
    }

    public ResidentStatus getStatus() {
        return status;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public void setApartment(String apartment) {
        this.apartment = apartment;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setStatus(ResidentStatus status) {
        this.status = status;
    }
}