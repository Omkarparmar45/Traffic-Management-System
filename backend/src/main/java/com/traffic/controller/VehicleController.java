package com.traffic.controller;

import com.traffic.model.Vehicle;
import com.traffic.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

  private final VehicleRepository vehicleRepository;

  @GetMapping
  public List<Vehicle> getAllVehicles() {
    return vehicleRepository.findAll();
  }

  @PostMapping
  public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
    return vehicleRepository.save(vehicle);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
    return vehicleRepository.findById(id)
      .map(existing -> {
        existing.setPlateNumber(vehicle.getPlateNumber());
        existing.setType(vehicle.getType());
        existing.setOwnerName(vehicle.getOwnerName());
        existing.setRegisteredDate(vehicle.getRegisteredDate());
        existing.setStatus(vehicle.getStatus());
        Vehicle updated = vehicleRepository.save(existing);
        return ResponseEntity.ok(updated);
      })
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
    try {
      vehicleRepository.deleteById(id);
      return ResponseEntity.noContent().build();
    } catch (IllegalArgumentException | NoSuchElementException e) {
      return ResponseEntity.notFound().build();
    }
  }
}