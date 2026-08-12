package com.traffic.controller;

import com.traffic.model.Signal;
import com.traffic.service.SignalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/signals")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*" })
public class SignalController {

    private final SignalService signalService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSignals() {
        log.info("REST request to get all signals");
        try {
            List<Signal> signals = signalService.getAllSignals();
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("count", signals.size());
            result.put("data", signals);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching signals: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch signals: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/control")
    public ResponseEntity<Map<String, Object>> controlAllSignals(@RequestBody Map<String, String> body) {
        log.info("REST request to set all signals state: {}", body);
        try {
            String state = body.get("state");
            List<Signal> updated = signalService.setAllSignalsState(state);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "All signals updated");
            result.put("data", updated);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error updating all signals: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/{id}/control")
    public ResponseEntity<Map<String, Object>> controlSignal(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        log.info("REST request to set signal {} state: {}", id, body);
        try {
            String state = body.get("state");
            Signal updated = signalService.setSignalState(id, state);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Signal updated");
            result.put("data", updated);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error updating signal {}: {}", id, e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
