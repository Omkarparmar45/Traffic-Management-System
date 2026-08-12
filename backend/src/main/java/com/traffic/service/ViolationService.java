package com.traffic.service;

import com.traffic.dto.ViolationRequest;
import com.traffic.dto.ViolationResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Service interface for managing traffic violations
 * 
 * Defines business logic operations for violation management
 */
public interface ViolationService {

    /**
     * Record a new traffic violation
     */
    ViolationResponse recordViolation(ViolationRequest request);

    /**
     * Get all violations
     */
    List<ViolationResponse> getAllViolations();

    /**
     * Get violation by ID
     */
    ViolationResponse getViolationById(Long id);

    /**
     * Search violations by vehicle number
     */
    List<ViolationResponse> searchByVehicleNumber(String vehicleNumber);

    /**
     * Get violations by status
     */
    List<ViolationResponse> getViolationsByStatus(String status);

    /**
     * Get violations within date range
     */
    List<ViolationResponse> getViolationsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Get violations by location
     */
    List<ViolationResponse> getViolationsByLocation(String location);

    /**
     * Update violation status
     */
    ViolationResponse updateViolationStatus(Long id, String status);

    /**
     * Delete a violation
     */
    void deleteViolation(Long id);

    /**
     * Get violation statistics
     */
    Map<String, Long> getViolationStatistics();

    /**
     * Get all helmet violations
     */
    List<ViolationResponse> getHelmetViolations();

    /**
     * Get all overloading violations
     */
    List<ViolationResponse> getOverloadingViolations();
}
