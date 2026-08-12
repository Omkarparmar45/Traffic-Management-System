package com.traffic.controller;

import com.traffic.model.Road;
import com.traffic.service.RoadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roads")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*" })
public class RoadController {

  private final RoadService roadService;

  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllRoads() {
    log.info("REST request to get all roads");

    try {
      List<Road> roads = roadService.getAllRoads();
      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("count", roads.size());
      result.put("data", roads);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.error("Error fetching roads: {}", e.getMessage());
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", "Failed to fetch roads: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
  }

  @PostMapping
  public ResponseEntity<Map<String, Object>> addRoad(@RequestBody Road road) {
    log.info("REST request to add road: {}", road != null ? road.getName() : null);

    try {
      Road savedRoad = roadService.addRoad(road);
      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("message", "Road added successfully");
      result.put("data", savedRoad);
      return ResponseEntity.status(HttpStatus.CREATED).body(result);
    } catch (Exception e) {
      log.error("Error adding road: {}", e.getMessage());
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<Map<String, Object>> updateRoadStatus(
      @PathVariable Long id,
      @RequestBody Map<String, String> statusUpdate) {
    log.info("REST request to update road {} status", id);

    try {
      String status = statusUpdate.get("status");
      String congestionLevel = statusUpdate.get("congestionLevel");
      Road updatedRoad = roadService.updateRoadStatus(id, status, congestionLevel);

      Map<String, Object> result = new HashMap<>();
      result.put("success", true);
      result.put("message", "Road status updated successfully");
      result.put("data", updatedRoad);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.error("Error updating road {} status: {}", id, e.getMessage());
      Map<String, Object> error = new HashMap<>();
      error.put("success", false);
      error.put("message", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }
}
