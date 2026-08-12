package com.traffic.controller;

import com.traffic.dto.ViolationRequest;
import com.traffic.dto.ViolationResponse;
import com.traffic.service.ViolationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Traffic Violation Management
 * 
 * Provides endpoints for:
 * - Recording violations
 * - Viewing violations
 * - Searching violations
 * - Managing violation status
 * - Getting statistics
 */
@RestController
@RequestMapping("/api/violations")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*" })
public class ViolationController {

    private final ViolationService violationService;

    /**
     * Record a new traffic violation
     * POST /api/violations
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> recordViolation(@Valid @RequestBody ViolationRequest request) {
        log.info("REST request to record violation for vehicle: {}", request.getVehicleNumber());

        try {
            ViolationResponse response = violationService.recordViolation(request);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Violation recorded successfully");
            result.put("data", response);

            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            log.error("Error recording violation: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to record violation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all violations
     * GET /api/violations
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllViolations() {
        log.info("REST request to get all violations");

        try {
            List<ViolationResponse> violations = violationService.getAllViolations();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", violations.size());
            result.put("data", violations);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching violations: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch violations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get violation by ID
     * GET /api/violations/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getViolationById(@PathVariable Long id) {
        log.info("REST request to get violation: {}", id);

        try {
            ViolationResponse violation = violationService.getViolationById(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", violation);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching violation: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Search violations by vehicle number
     * GET /api/violations/search?vehicleNumber=ABC123
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchViolations(
            @RequestParam(required = false) String vehicleNumber) {
        log.info("REST request to search violations with vehicle number: {}", vehicleNumber);

        try {
            List<ViolationResponse> violations = violationService.searchByVehicleNumber(vehicleNumber);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", violations.size());
            result.put("data", violations);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error searching violations: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to search violations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get violations by status
     * GET /api/violations/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getViolationsByStatus(@PathVariable String status) {
        log.info("REST request to get violations with status: {}", status);

        try {
            List<ViolationResponse> violations = violationService.getViolationsByStatus(status);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", violations.size());
            result.put("data", violations);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching violations by status: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch violations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get violations by location
     * GET /api/violations/location?name=Downtown
     */
    @GetMapping("/location")
    public ResponseEntity<Map<String, Object>> getViolationsByLocation(@RequestParam String name) {
        log.info("REST request to get violations at location: {}", name);

        try {
            List<ViolationResponse> violations = violationService.getViolationsByLocation(name);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", violations.size());
            result.put("data", violations);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching violations by location: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch violations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get helmet violations
     * GET /api/violations/helmet
     */
    @GetMapping("/helmet")
    public ResponseEntity<Map<String, Object>> getHelmetViolations() {
        log.info("REST request to get helmet violations");

        try {
            List<ViolationResponse> violations = violationService.getHelmetViolations();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", violations.size());
            result.put("data", violations);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching helmet violations: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch violations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get overloading violations
     * GET /api/violations/overloading
     */
    @GetMapping("/overloading")
    public ResponseEntity<Map<String, Object>> getOverloadingViolations() {
        log.info("REST request to get overloading violations");

        try {
            List<ViolationResponse> violations = violationService.getOverloadingViolations();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", violations.size());
            result.put("data", violations);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching overloading violations: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch violations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update violation status
     * PATCH /api/violations/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateViolationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        log.info("REST request to update violation {} status", id);

        try {
            String status = statusUpdate.get("status");
            ViolationResponse response = violationService.updateViolationStatus(id, status);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Status updated successfully");
            result.put("data", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error updating violation status: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Delete a violation
     * DELETE /api/violations/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteViolation(@PathVariable Long id) {
        log.info("REST request to delete violation: {}", id);

        try {
            violationService.deleteViolation(id);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Violation deleted successfully");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error deleting violation: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get violation statistics
     * GET /api/violations/statistics
     */
    @GetMapping("/stats/summary")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        log.info("REST request to get violation statistics");

        try {
            Map<String, Long> statistics = violationService.getViolationStatistics();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", statistics);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching statistics: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch statistics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
