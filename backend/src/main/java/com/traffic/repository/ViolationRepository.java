package com.traffic.repository;

import com.traffic.model.Violation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Violation entity
 * 
 * Provides CRUD operations and custom query methods for traffic violations
 */
@Repository
public interface ViolationRepository extends JpaRepository<Violation, Long> {

    /**
     * Find all violations by vehicle number
     */
    List<Violation> findByVehicleNumberContainingIgnoreCase(String vehicleNumber);

    /**
     * Find all violations by status
     */
    List<Violation> findByStatus(String status);

    /**
     * Find all helmet violations
     */
    List<Violation> findByHelmetViolationTrue();

    /**
     * Find all overloading violations
     */
    List<Violation> findByOverloadingViolationTrue();

    /**
     * Find violations within a date range
     */
    List<Violation> findByViolationDateTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find violations by location
     */
    List<Violation> findByLocationContainingIgnoreCase(String location);

    /**
     * Count violations by status
     */
    @Query("SELECT COUNT(v) FROM Violation v WHERE v.status = :status")
    Long countByStatus(@Param("status") String status);

    /**
     * Count total helmet violations
     */
    @Query("SELECT COUNT(v) FROM Violation v WHERE v.helmetViolation = true")
    Long countHelmetViolations();

    /**
     * Count total overloading violations
     */
    @Query("SELECT COUNT(v) FROM Violation v WHERE v.overloadingViolation = true")
    Long countOverloadingViolations();

    /**
     * Find all violations ordered by date descending
     */
    List<Violation> findAllByOrderByViolationDateTimeDesc();
}
