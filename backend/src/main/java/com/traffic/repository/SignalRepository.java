package com.traffic.repository;

import com.traffic.model.Signal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SignalRepository extends JpaRepository<Signal, Long> {
  List<Signal> findAllByOrderByIdAsc();
}