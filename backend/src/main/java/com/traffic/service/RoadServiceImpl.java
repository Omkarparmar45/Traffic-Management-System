package com.traffic.service;

import com.traffic.model.Road;
import com.traffic.repository.RoadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoadServiceImpl implements RoadService {

  private static final Set<String> ALLOWED_STATUS = Set.of("OPEN", "CONGESTED", "MAINTENANCE", "CLOSED");
  private static final Set<String> ALLOWED_CONGESTION = Set.of("LOW", "MEDIUM", "HIGH", "SEVERE");

  private final RoadRepository roadRepository;

  @Override
  public List<Road> getAllRoads() {
    if (roadRepository.count() == 0) {
      seedDefaultRoads();
    }

    return roadRepository.findAllByOrderByIdAsc();
  }

  @Override
  public Road addRoad(Road road) {
    if (road == null) {
      throw new RuntimeException("Road details are required");
    }

    if (road.getName() == null || road.getName().isBlank()) {
      throw new RuntimeException("Road name is required");
    }

    road.setStatus(road.getStatus() == null ? "OPEN" : normalizeStatus(road.getStatus()));
    road.setCongestionLevel(
        road.getCongestionLevel() == null ? "MEDIUM" : normalizeCongestion(road.getCongestionLevel()));
    road.setSpeedLimit((road.getSpeedLimit() == null || road.getSpeedLimit() <= 0) ? 50 : road.getSpeedLimit());
    road.setUpdatedAt(LocalDateTime.now());

    return roadRepository.save(road);
  }

  @Override
  public Road updateRoadStatus(Long id, String status, String congestionLevel) {
    Road road = roadRepository.findById(id).orElse(null);
    if (road == null) {
      throw new RuntimeException("Road not found: " + id);
    }

    if (status != null && !status.isBlank()) {
      road.setStatus(normalizeStatus(status));
    }

    if (congestionLevel != null && !congestionLevel.isBlank()) {
      road.setCongestionLevel(normalizeCongestion(congestionLevel));
    }

    road.setUpdatedAt(LocalDateTime.now());
    return roadRepository.save(road);
  }

  private String normalizeStatus(String status) {
    String normalized = status.trim().toUpperCase(Locale.ROOT);
    if (!ALLOWED_STATUS.contains(normalized)) {
      throw new RuntimeException("Invalid road status: " + status);
    }
    return normalized;
  }

  private String normalizeCongestion(String congestionLevel) {
    String normalized = congestionLevel.trim().toUpperCase(Locale.ROOT);
    if (!ALLOWED_CONGESTION.contains(normalized)) {
      throw new RuntimeException("Invalid congestion level: " + congestionLevel);
    }
    return normalized;
  }

  private void seedDefaultRoads() {
    log.info("Seeding default roads");

    roadRepository.saveAll(List.of(
        createRoad("NH-19 Main Corridor", "North Zone", "OPEN", "MEDIUM", 60),
        createRoad("City Center Ring Road", "Central Zone", "CONGESTED", "HIGH", 40),
        createRoad("Govardhan Link Road", "West Zone", "OPEN", "LOW", 50),
        createRoad("Industrial Bypass", "South Zone", "MAINTENANCE", "MEDIUM", 35),
        createRoad("School Belt Connector", "East Zone", "OPEN", "HIGH", 30),
        createRoad("Bus Stand Feeder", "Central Zone", "CONGESTED", "SEVERE", 25)));
  }

  private Road createRoad(String name, String zone, String status, String congestionLevel, Integer speedLimit) {
    Road road = new Road();
    road.setName(name);
    road.setZone(zone);
    road.setStatus(status);
    road.setCongestionLevel(congestionLevel);
    road.setSpeedLimit(speedLimit);
    road.setUpdatedAt(LocalDateTime.now());
    return road;
  }
}
