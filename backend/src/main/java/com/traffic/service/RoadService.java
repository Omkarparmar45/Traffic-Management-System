package com.traffic.service;

import com.traffic.model.Road;

import java.util.List;

public interface RoadService {
  List<Road> getAllRoads();

  Road addRoad(Road road);

  Road updateRoadStatus(Long id, String status, String congestionLevel);
}
