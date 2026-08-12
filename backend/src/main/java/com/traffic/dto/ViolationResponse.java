package com.traffic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Violation responses
 * 
 * This DTO is used for API responses when returning violation data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViolationResponse {

    private Long id;
    private String vehicleNumber;
    private String vehicleType;
    private Boolean helmetViolation;
    private Boolean overloadingViolation;
    private Integer passengerCount;
    private String location;
    private LocalDateTime violationDateTime;
    private String remarks;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Helper method to get violation type as string
    public String getViolationType() {
        if (helmetViolation && overloadingViolation) {
            return "Helmet & Overloading";
        } else if (helmetViolation) {
            return "No Helmet";
        } else if (overloadingViolation) {
            return "Overloading";
        }
        return "None";
    }
}
