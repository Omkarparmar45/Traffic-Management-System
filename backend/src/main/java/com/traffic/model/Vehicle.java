package com.traffic.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "vehicles")
public class Vehicle {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String plateNumber;
  private String type; // Car, Truck, Motorcycle, Bus
  private String ownerName;
  private LocalDate registeredDate;
  private String status; // Active, Inactive
}