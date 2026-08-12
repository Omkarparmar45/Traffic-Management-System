package com.traffic.service;

import com.traffic.model.Signal;
import com.traffic.repository.SignalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class SignalServiceImpl implements SignalService {

    private static final Set<String> ALLOWED_STATES = Set.of("RED", "YELLOW", "GREEN");

    private final SignalRepository signalRepository;

    @Override
    public List<Signal> getAllSignals() {
        if (signalRepository.count() == 0) {
            seedDefaultSignals();
        }

        return signalRepository.findAllByOrderByIdAsc();
    }

    @Override
    public List<Signal> setAllSignalsState(String state) {
        String normalizedState = normalizeState(state);
        List<Signal> signals = getAllSignals();

        for (Signal signal : signals) {
            signal.setState(normalizedState);
            signal.setUpdatedAt(LocalDateTime.now());
        }

        signalRepository.saveAll(signals);
        return signalRepository.findAllByOrderByIdAsc();
    }

    @Override
    public Signal setSignalState(Long id, String state) {
        String normalizedState = normalizeState(state);

        Signal signal = signalRepository.findById(id).orElse(null);
        if (signal == null) {
            throw new RuntimeException("Signal not found: " + id);
        }

        signal.setState(normalizedState);
        signal.setUpdatedAt(LocalDateTime.now());
        return signalRepository.save(signal);
    }

    private String normalizeState(String state) {
        if (state == null || state.isBlank()) {
            throw new RuntimeException("Signal state cannot be empty");
        }

        String normalized = state.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_STATES.contains(normalized)) {
            throw new RuntimeException("Invalid signal state: " + state);
        }

        return normalized;
    }

    private void seedDefaultSignals() {
        log.info("Seeding default traffic signals");

        signalRepository.saveAll(List.of(
                createSignal("Govardhan Chauraha", "NH-19, Crossing Point 1", "GREEN", 99.2),
                createSignal("Chhatikara", "NH-19, Block A", "RED", 98.7),
                createSignal("Highway Gate 3", "Ring Road, Exit 3", "YELLOW", 97.5),
                createSignal("School Zone East", "Sector 12, Near DPS", "GREEN", 99.8),
                createSignal("Industrial Bypass", "Phase 2, Factory Road", "RED", 96.4),
                createSignal("Railway Circle", "Station Link Road", "GREEN", 97.9),
                createSignal("Bus Stand Junction", "Central Bus Terminal", "GREEN", 98.3),
                createSignal("City Mall Square", "Mall Road Crossing", "YELLOW", 97.1)));
    }

    private Signal createSignal(String name, String location, String state, Double uptime) {
        Signal signal = new Signal();
        signal.setName(name);
        signal.setLocation(location);
        signal.setState(state);
        signal.setUptime(uptime);
        signal.setUpdatedAt(LocalDateTime.now());
        return signal;
    }
}
