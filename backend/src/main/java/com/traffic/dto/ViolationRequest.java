package com.traffic.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for creating/updating a Violation
 * 
 * This DTO is used for API requests to record new violations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViolationRequest {

    @NotBlank(message = "Vehicle number is required")
    @Size(max = 20, message = "Vehicle number must not exceed 20 characters")
    private String vehicleNumber;

    @NotBlank(message = "Vehicle type is required")
    @Size(max = 50, message = "Vehicle type must not exceed 50 characters")
    private String vehicleType;

    @NotNull(message = "Helmet violation status is required")
    private Boolean helmetViolation;

    @NotNull(message = "Overloading violation status is required")
    private Boolean overloadingViolation;

    @NotNull(message = "Passenger count is required")
    @Min(value = 1, message = "Passenger count must be at least 1")
    @Max(value = 10, message = "Passenger count must not exceed 10")
    private Integer passengerCount;

    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @NotNull(message = "Violation date and time is required")
    private LocalDateTime violationDateTime;

    @Size(max = 500, message = "Remarks must not exceed 500 characters")
    private String remarks;

    private String status; // PENDING, REVIEWED, RESOLVED
}
