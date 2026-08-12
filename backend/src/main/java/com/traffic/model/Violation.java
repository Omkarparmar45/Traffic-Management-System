package com.traffic.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entity class representing a Traffic Violation
 * 
 * This entity stores information about traffic rule violations including:
 * - Helmet violations
 * - Overloading violations (more than 2 persons on two-wheeler)
 */
@Entity
@Table(name = "violations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Violation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String vehicleNumber;

    @Column(nullable = false, length = 50)
    private String vehicleType;

    @Column(nullable = false)
    private Boolean helmetViolation;

    @Column(nullable = false)
    private Boolean overloadingViolation;

    @Column(nullable = false)
    private Integer passengerCount;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false)
    private LocalDateTime violationDateTime;

    @Column(length = 500)
    private String remarks;

    @Column(nullable = false, length = 20)
    private String status; // PENDING, REVIEWED, RESOLVED

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
