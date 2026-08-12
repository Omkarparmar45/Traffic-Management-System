package com.traffic.service;

import com.traffic.model.Signal;
import java.util.List;

public interface SignalService {
    List<Signal> getAllSignals();
    List<Signal> setAllSignalsState(String state);
    Signal setSignalState(Long id, String state);
}
