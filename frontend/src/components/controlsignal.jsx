import React, { useEffect, useState } from 'react';
import signalService from '../services/signalService.js';
import './controlsignal.css';

function ControlSignal() {
  const [signals, setSignals] = useState([]);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSignals = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await signalService.getAllSignals();
      if (res && res.success) {
        setSignals(res.data || []);
      } else {
        setError(res?.message || 'Failed to load signals');
      }
    } catch (e) {
      setError('Failed to load signals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignals();
  }, []);

  const setAll = async (state) => {
    setLoading(true);
    setError('');
    try {
      const res = await signalService.setAllSignalsState(state);
      if (res && res.success) {
        setSignals(res.data || []);
        setSelections({});
      } else {
        setError(res?.message || 'Failed to update all signals');
      }
    } catch (e) {
      setError('Failed to update all signals');
    } finally {
      setLoading(false);
    }
  };

  const setOne = async (id) => {
    const desired = selections[id] || signals.find(s => s.id === id)?.state;
    if (!desired) return;
    setLoading(true);
    setError('');
    try {
      const res = await signalService.setSignalState(id, desired);
      if (res && res.success) {
        // response may include updated signal in data
        const updated = res.data || null;
        setSignals(prev => prev.map(s => (s.id === id && updated) ? updated : s));
      } else {
        setError(res?.message || 'Failed to update signal');
      }
    } catch (e) {
      setError('Failed to update signal');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (id, value) => {
    setSelections(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="control-signal">
      <div className="control-header">
        <h2>🚦 Control Signals</h2>
        <div className="control-actions">
          <button className="control-button" onClick={() => setAll('GREEN')}>Set All GREEN</button>
          <button className="control-button" onClick={() => setAll('YELLOW')}>Set All YELLOW</button>
          <button className="control-button" onClick={() => setAll('RED')}>Set All RED</button>
          <button className="refresh-button" onClick={loadSignals}>Refresh</button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="table-container signals-table-container">
        <table className="signals-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {signals.map(signal => (
              <tr key={signal.id}>
                <td>{signal.id}</td>
                <td>{signal.location}</td>
                <td>{signal.state}</td>
                <td>
                  <select className="state-select" value={selections[signal.id] ?? signal.state} onChange={(e) => handleSelectChange(signal.id, e.target.value)}>
                    <option value="RED">RED</option>
                    <option value="YELLOW">YELLOW</option>
                    <option value="GREEN">GREEN</option>
                  </select>
                  <button className="apply-button" onClick={() => setOne(signal.id)}>Apply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ControlSignal;
