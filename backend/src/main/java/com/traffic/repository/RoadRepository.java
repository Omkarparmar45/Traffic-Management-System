package com.traffic.repository;

import com.traffic.model.Road;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadRepository extends JpaRepository<Road, Long> {
  List<Road> findAllByOrderByIdAsc();

  long countByStatus(String status);
}
