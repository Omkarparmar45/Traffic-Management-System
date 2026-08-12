package com.traffic.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "roads")
public class Road {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String zone;

  private String status; // OPEN, CONGESTED, MAINTENANCE, CLOSED

  private String congestionLevel; // LOW, MEDIUM, HIGH, SEVERE

  private Integer speedLimit;

  private LocalDateTime updatedAt;

  @PrePersist
  public void onCreate() {
    if (updatedAt == null) {
      updatedAt = LocalDateTime.now();
    }
  }

  @PreUpdate
  public void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
