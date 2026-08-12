import React, { useEffect, useMemo, useState } from 'react';
import { CircleDot, MapPin, RefreshCw, TrafficCone } from 'lucide-react';
import signalService from '../services/signalService.js';

const STATE_ORDER = ['RED', 'YELLOW', 'GREEN'];

const stateBadgeClass = {
  RED: 'bg-red-500/15 text-red-300 border-red-500/30',
  YELLOW: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  GREEN: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

const stateButtonClass = {
  RED: 'bg-[#2d1b1b] hover:bg-[#421b1b] border-red-900/50 text-red-300',
  YELLOW: 'bg-[#2d250c] hover:bg-[#413511] border-yellow-900/50 text-yellow-300',
  GREEN: 'bg-[#113a1e] hover:bg-[#164e30] border-green-900/50 text-green-300',
};

const formatUpdatedTime = (value) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const SignalControl = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [selectedSignalId, setSelectedSignalId] = useState(null);
  const [selectedState, setSelectedState] = useState('GREEN');

  const loadSignals = async () => {
    try {
      setLoading(true);
      const response = await signalService.getAllSignals();

      if (response?.success) {
        const signalData = response.data || [];
        setSignals(signalData);
        setError('');

        if (signalData.length > 0) {
          const firstId = signalData[0].id;
          setSelectedSignalId((prev) => prev ?? firstId);
        }
      } else {
        setError(response?.message || 'Failed to fetch signals');
      }
    } catch (err) {
      setError('Failed to fetch signals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignals();
  }, []);

  const selectedSignal = useMemo(
    () => signals.find((signal) => signal.id === selectedSignalId) || null,
    [signals, selectedSignalId],
  );

  useEffect(() => {
    if (selectedSignal) {
      setSelectedState(selectedSignal.state);
    }
  }, [selectedSignal]);

  const stats = useMemo(() => {
    const counts = {
      RED: 0,
      YELLOW: 0,
      GREEN: 0,
      TOTAL: signals.length,
    };

    signals.forEach((signal) => {
      if (counts[signal.state] !== undefined) {
        counts[signal.state] += 1;
      }
    });

    return counts;
  }, [signals]);

  const handleSetAllSignals = async (state) => {
    try {
      setUpdating(true);
      setMessage('');

      const response = await signalService.setAllSignalsState(state);
      if (response?.success) {
        setSignals(response.data || []);
        setError('');
        setMessage(`All signals changed to ${state}`);
      } else {
        setError(response?.message || 'Failed to update all signals');
      }
    } catch (err) {
      setError('Failed to update all signals');
    } finally {
      setUpdating(false);
    }
  };

  const handleSetSelectedSignal = async () => {
    if (!selectedSignalId || !selectedState) {
      return;
    }

    try {
      setUpdating(true);
      setMessage('');

      const response = await signalService.setSignalState(selectedSignalId, selectedState);
      if (response?.success && response.data) {
        setSignals((prev) =>
          prev.map((signal) => (signal.id === selectedSignalId ? response.data : signal)),
        );
        setError('');
        setMessage(`Signal ${selectedSignal?.name || selectedSignalId} updated`);
      } else {
        setError(response?.message || 'Failed to update selected signal');
      }
    } catch (err) {
      setError('Failed to update selected signal');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="text-gray-200 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Signal Control Center</h1>
          <p className="text-sm text-gray-400 mt-1">Monitor and update traffic signal states in real-time</p>
        </div>

        <button
          type="button"
          onClick={loadSignals}
          disabled={loading || updating}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-xs uppercase text-red-300">Red</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.RED}</p>
        </article>
        <article className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-xs uppercase text-yellow-300">Yellow</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.YELLOW}</p>
        </article>
        <article className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase text-emerald-300">Green</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.GREEN}</p>
        </article>
        <article className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="text-xs uppercase text-blue-300">Total Signals</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.TOTAL}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-xl border border-slate-700 bg-[#111827] p-5 space-y-4">
          <h2 className="text-lg font-semibold text-white">Control Panel</h2>

          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">Select Signal</label>
            <select
              value={selectedSignalId ?? ''}
              onChange={(e) => setSelectedSignalId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            >
              {signals.map((signal) => (
                <option key={signal.id} value={signal.id}>
                  {signal.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm">
            <p className="font-semibold text-white inline-flex items-center gap-2">
              <TrafficCone size={15} />
              {selectedSignal?.name || 'No Signal Selected'}
            </p>
            <p className="text-slate-400 mt-2 inline-flex items-center gap-2">
              <MapPin size={13} />
              {selectedSignal?.location || 'N/A'}
            </p>
            <p className="text-slate-400 mt-1">Updated: {formatUpdatedTime(selectedSignal?.updatedAt)}</p>
            <p className="text-emerald-300 mt-1">Uptime: {selectedSignal?.uptime ?? 'N/A'}%</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-2">State</label>
            <div className="grid grid-cols-3 gap-2">
              {STATE_ORDER.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setSelectedState(state)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${stateButtonClass[state]} ${selectedState === state ? 'ring-2 ring-white/20' : ''}`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSetSelectedSignal}
            disabled={!selectedSignalId || updating}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            Apply to Selected Signal
          </button>

          <div className="grid grid-cols-3 gap-2">
            {STATE_ORDER.map((state) => (
              <button
                key={`all-${state}`}
                type="button"
                onClick={() => handleSetAllSignals(state)}
                disabled={updating}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${stateButtonClass[state]}`}
              >
                Set All {state}
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-700 bg-[#111827] overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-3 border-b border-slate-700 bg-slate-900/70 px-4 py-3 text-xs uppercase tracking-wide text-slate-400">
            <p>Signal</p>
            <p>Location</p>
            <p>State</p>
            <p>Uptime</p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-slate-300">Loading signals...</div>
          ) : signals.length === 0 ? (
            <div className="p-6 text-sm text-slate-400">No signals available</div>
          ) : (
            <div className="divide-y divide-slate-700">
              {signals.map((signal) => (
                <div
                  key={signal.id}
                  className={`grid grid-cols-[2fr_2fr_1fr_1fr] gap-3 px-4 py-3 items-center hover:bg-slate-900/40 ${signal.id === selectedSignalId ? 'bg-blue-500/10' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedSignalId(signal.id)}
                    className="text-left"
                  >
                    <p className="font-medium text-white">{signal.name}</p>
                    <p className="text-xs text-slate-500 mt-1">ID #{signal.id}</p>
                  </button>

                  <p className="text-sm text-slate-300">{signal.location}</p>

                  <p>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${stateBadgeClass[signal.state] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'}`}>
                      <CircleDot size={11} />
                      {signal.state}
                    </span>
                  </p>

                  <p className="text-sm text-emerald-300">{signal.uptime ?? 'N/A'}%</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      )}
    </div>
  );
};

export default SignalControl;