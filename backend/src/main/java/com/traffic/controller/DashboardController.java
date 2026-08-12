package com.traffic.controller;

import com.traffic.repository.SignalRepository;
import com.traffic.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*" })
public class DashboardController {

  private final VehicleRepository vehicleRepository;
  private final SignalRepository signalRepository;

  @GetMapping("/stats")
  public Map<String, Object> getDashboardStats() {
    Map<String, Object> stats = new HashMap<>();
    stats.put("totalVehicles", vehicleRepository.count());
    stats.put("activeSignals", signalRepository.count());
    stats.put("trafficIndex", "72%");
    stats.put("violationsToday", 38);
    return stats;
  }
}