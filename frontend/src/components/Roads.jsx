import React, { useEffect, useMemo, useState } from 'react';
import { CircleDot, MapPin, Plus, RefreshCw, Search } from 'lucide-react';
import roadService from '../services/roadService.js';

const STATUS_OPTIONS = ['OPEN', 'CONGESTED', 'MAINTENANCE', 'CLOSED'];
const CONGESTION_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'SEVERE'];

const statusBadgeClass = {
  OPEN: 'bg-green-500/15 text-green-300 border-green-500/30',
  CONGESTED: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  MAINTENANCE: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  CLOSED: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const congestionBadgeClass = {
  LOW: 'text-emerald-300',
  MEDIUM: 'text-blue-300',
  HIGH: 'text-amber-300',
  SEVERE: 'text-rose-300',
};

const Roads = () => {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newRoad, setNewRoad] = useState({
    name: '',
    zone: '',
    status: 'OPEN',
    congestionLevel: 'MEDIUM',
    speedLimit: 50,
  });

  const [statusDrafts, setStatusDrafts] = useState({});
  const [congestionDrafts, setCongestionDrafts] = useState({});

  const loadRoads = async () => {
    try {
      setLoading(true);
      const response = await roadService.getAllRoads();

      if (response?.success) {
        setRoads(response.data || []);
        setError('');
      } else {
        setError(response?.message || 'Failed to load roads');
      }
    } catch (err) {
      setError('Failed to load roads from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoads();
  }, []);

  const stats = useMemo(() => {
    const total = roads.length;
    const open = roads.filter((road) => road.status === 'OPEN').length;
    const congested = roads.filter((road) => road.status === 'CONGESTED').length;
    const maintenance = roads.filter((road) => road.status === 'MAINTENANCE').length;
    const closed = roads.filter((road) => road.status === 'CLOSED').length;

    return { total, open, congested, maintenance, closed };
  }, [roads]);

  const filteredRoads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return roads;
    }

    return roads.filter((road) => {
      const name = (road.name || '').toLowerCase();
      const zone = (road.zone || '').toLowerCase();
      return name.includes(query) || zone.includes(query);
    });
  }, [roads, searchTerm]);

  const handleAddRoad = async (event) => {
    event.preventDefault();

    try {
      setUpdating(true);
      setMessage('');

      const response = await roadService.addRoad({
        ...newRoad,
        speedLimit: Number(newRoad.speedLimit),
      });

      if (response?.success && response.data) {
        setRoads((prev) => [...prev, response.data]);
        setShowAddForm(false);
        setNewRoad({
          name: '',
          zone: '',
          status: 'OPEN',
          congestionLevel: 'MEDIUM',
          speedLimit: 50,
        });
        setError('');
        setMessage('Road added successfully');
      } else {
        setError(response?.message || 'Unable to add road');
      }
    } catch (err) {
      setError('Unable to add road');
    } finally {
      setUpdating(false);
    }
  };

  const handleApplyUpdate = async (road) => {
    const nextStatus = statusDrafts[road.id] || road.status;
    const nextCongestion = congestionDrafts[road.id] || road.congestionLevel;

    try {
      setUpdating(true);
      setMessage('');

      const response = await roadService.updateRoadStatus(road.id, {
        status: nextStatus,
        congestionLevel: nextCongestion,
      });

      if (response?.success && response.data) {
        setRoads((prev) => prev.map((item) => (item.id === road.id ? response.data : item)));
        setError('');
        setMessage(`Road ${road.name} updated`);
      } else {
        setError(response?.message || 'Failed to update road');
      }
    } catch (err) {
      setError('Failed to update road status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="text-gray-200 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roads Management</h1>
          <p className="text-sm text-gray-400 mt-1">Track road availability, congestion, and maintenance</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadRoads}
            disabled={loading || updating}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/15 px-3 py-2 text-sm text-blue-200 hover:bg-blue-500/25"
          >
            <Plus size={15} />
            {showAddForm ? 'Close Form' : 'Add Road'}
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-xl border border-slate-700 bg-[#111827] p-4">
          <p className="text-xs text-gray-400 uppercase">Total Roads</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.total}</p>
        </article>
        <article className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-xs text-green-300 uppercase">Open</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.open}</p>
        </article>
        <article className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-xs text-yellow-300 uppercase">Congested</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.congested}</p>
        </article>
        <article className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="text-xs text-blue-300 uppercase">Maintenance</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.maintenance}</p>
        </article>
        <article className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-xs text-red-300 uppercase">Closed</p>
          <p className="text-2xl font-semibold text-white mt-2">{stats.closed}</p>
        </article>
      </section>

      {showAddForm && (
        <form onSubmit={handleAddRoad} className="rounded-xl border border-slate-700 bg-[#111827] p-4 space-y-4">
          <h2 className="text-lg font-semibold text-white">Add New Road</h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={newRoad.name}
              onChange={(e) => setNewRoad((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Road name"
              required
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
            <input
              value={newRoad.zone}
              onChange={(e) => setNewRoad((prev) => ({ ...prev, zone: e.target.value }))}
              placeholder="Zone"
              required
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
            <select
              value={newRoad.status}
              onChange={(e) => setNewRoad((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={newRoad.congestionLevel}
              onChange={(e) => setNewRoad((prev) => ({ ...prev, congestionLevel: e.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            >
              {CONGESTION_OPTIONS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <input
              type="number"
              value={newRoad.speedLimit}
              onChange={(e) => setNewRoad((prev) => ({ ...prev, speedLimit: e.target.value }))}
              min="20"
              max="120"
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            Save Road
          </button>
        </form>
      )}

      <div className="rounded-xl border border-slate-700 bg-[#111827] p-4">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search road by name or zone"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

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

      <section className="rounded-xl border border-slate-700 bg-[#111827] overflow-hidden">
        <div className="grid grid-cols-[2.2fr_1.3fr_1fr_1fr_1fr_1.6fr] gap-3 border-b border-slate-700 bg-slate-900/70 px-4 py-3 text-xs uppercase tracking-wide text-slate-400">
          <p>Road</p>
          <p>Zone</p>
          <p>Status</p>
          <p>Congestion</p>
          <p>Speed</p>
          <p>Actions</p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-300">Loading roads...</div>
        ) : filteredRoads.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No roads found</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredRoads.map((road) => (
              <div key={road.id} className="grid grid-cols-[2.2fr_1.3fr_1fr_1fr_1fr_1.6fr] gap-3 px-4 py-3 items-center hover:bg-slate-900/40">
                <div>
                  <p className="font-medium text-white">{road.name}</p>
                  <p className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1">
                    <MapPin size={12} />
                    ID #{road.id}
                  </p>
                </div>

                <p className="text-sm text-slate-300">{road.zone}</p>

                <p>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${statusBadgeClass[road.status] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'}`}>
                    <CircleDot size={11} />
                    {road.status}
                  </span>
                </p>

                <p className={`text-sm font-medium ${congestionBadgeClass[road.congestionLevel] || 'text-slate-200'}`}>
                  {road.congestionLevel}
                </p>

                <p className="text-sm text-slate-300">{road.speedLimit} km/h</p>

                <div className="flex items-center gap-2">
                  <select
                    value={statusDrafts[road.id] || road.status}
                    onChange={(e) => setStatusDrafts((prev) => ({ ...prev, [road.id]: e.target.value }))}
                    className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>

                  <select
                    value={congestionDrafts[road.id] || road.congestionLevel}
                    onChange={(e) => setCongestionDrafts((prev) => ({ ...prev, [road.id]: e.target.value }))}
                    className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white outline-none"
                  >
                    {CONGESTION_OPTIONS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleApplyUpdate(road)}
                    disabled={updating}
                    className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Roads;
