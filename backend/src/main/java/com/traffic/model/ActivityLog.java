package com.traffic.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "activity_logs")
public class ActivityLog {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String description;
  private String location;
  private LocalDateTime timestamp;
  private String severity; // high, normal, low
  private String type; // violation, signal, vehicle, system
}