package com.traffic.service;

import com.traffic.dto.ViolationRequest;
import com.traffic.dto.ViolationResponse;
import com.traffic.model.Violation;
import com.traffic.repository.ViolationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of ViolationService
 * 
 * Handles all business logic for traffic violation management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ViolationServiceImpl implements ViolationService {

    private final ViolationRepository violationRepository;

    @Override
    public ViolationResponse recordViolation(ViolationRequest request) {
        log.info("Recording new violation for vehicle: {}", request.getVehicleNumber());
        
        // Validate overloading (more than 2 persons on two-wheeler)
        if (request.getPassengerCount() > 2 && !request.getOverloadingViolation()) {
            request.setOverloadingViolation(true);
        }
        
        Violation violation = mapToEntity(request);
        Violation savedViolation = violationRepository.save(violation);
        
        log.info("Violation recorded successfully with ID: {}", savedViolation.getId());
        return mapToResponse(savedViolation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ViolationResponse> getAllViolations() {
        log.info("Fetching all violations");
        List<Violation> violations = violationRepository.findAllByOrderByViolationDateTimeDesc();
        return violations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ViolationResponse getViolationById(Long id) {
        log.info("Fetching violation with ID: {}", id);
        Violation violation = violationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Violation not found with ID: " + id));
        return mapToResponse(violation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ViolationResponse> searchByVehicleNumber(String vehicleNumber) {
        log.info("Searching violations for vehicle: {}", vehicleNumber);
        List<Violation> violations = violationRepository.findByVehicleNumberContainingIgnoreCase(vehicleNumber);
        return violations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ViolationResponse> getViolationsByStatus(String status) {
        log.info("Fetching violations with status: {}", status);
        List<Violation> violations = violationRepository.findByStatus(status);
        return violations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ViolationResponse> getViolationsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching violations between {} and {}", startDate, endDate);
        List<Violation> violations = violationRepository.findByViolationDateTimeBetween(startDate, endDate);
        return violations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ViolationResponse> getViolationsByLocation(String location) {
        log.info("Fetching violations at location: {}", location);
        List<Violation> violations = violationRepository.findByLocationContainingIgnoreCase(location);
        return violations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ViolationResponse updateViolationStatus(Long id, String status) {
        log.info("Updating violation {} status to: {}", id, status);
        Violation violation = violationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Violation not found with ID: " + id));
        
        violation.setStatus(status);
        Violation updatedViolation = violationRepository.save(violation);
        
        log.info("Violation status updated successfully");
        return mapToResponse(updatedViolation);
    }

    @Override
    public void deleteViolation(Long id) {
        log.info("Deleting violation with ID: {}", id);
        if (!violationRepository.existsById(id)) {
            throw new RuntimeException("Violation not found with ID: " + id);
        }
        violationRepository.deleteById(id);
        log.info("Violation deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getViolationStatistics() {
        log.info("Generating violation statistics");
        
        Map<String, Long> statistics = new HashMap<>();
        statistics.put("totalViolations", violationRepository.count());
        statistics.put("helmetViolations", violationRepository.countHelmetViolations());
        statistics.put("overloadingViolations", violationRepository.countOverloadingViolations());
        statistics.put("pendingViolations", violationRepository.countByStatus("PENDING"));
        statistics.put("reviewedViolations", violationRepository.countByStatus("REVIEWED"));
        statistics.put("resolvedViolations", violationRepository.countByStatus("RESOLVED"));
        
        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ViolationResponse> getHelmetViolations() {
        log.info("Fetching all helmet violations");
        List<Violation> violations = violationRepository.findByHelmetViolationTrue();
        return violations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ViolationResponse> getOverloadingViolations() {
        log.info("Fetching all overloading violations");
        List<Violation> violations = violationRepository.findByOverloadingViolationTrue();
        return violations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Helper methods for mapping
    private Violation mapToEntity(ViolationRequest request) {
        Violation violation = new Violation();
        violation.setVehicleNumber(request.getVehicleNumber());
        violation.setVehicleType(request.getVehicleType());
        violation.setHelmetViolation(request.getHelmetViolation());
        violation.setOverloadingViolation(request.getOverloadingViolation());
        violation.setPassengerCount(request.getPassengerCount());
        violation.setLocation(request.getLocation());
        violation.setViolationDateTime(request.getViolationDateTime());
        violation.setRemarks(request.getRemarks());
        violation.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        return violation;
    }

    private ViolationResponse mapToResponse(Violation violation) {
        ViolationResponse response = new ViolationResponse();
        response.setId(violation.getId());
        response.setVehicleNumber(violation.getVehicleNumber());
        response.setVehicleType(violation.getVehicleType());
        response.setHelmetViolation(violation.getHelmetViolation());
        response.setOverloadingViolation(violation.getOverloadingViolation());
        response.setPassengerCount(violation.getPassengerCount());
        response.setLocation(violation.getLocation());
        response.setViolationDateTime(violation.getViolationDateTime());
        response.setRemarks(violation.getRemarks());
        response.setStatus(violation.getStatus());
        response.setCreatedAt(violation.getCreatedAt());
        response.setUpdatedAt(violation.getUpdatedAt());
        return response;
    }
}
