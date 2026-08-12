import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Shield,
  Users,
} from 'lucide-react';
import violationService from '../services/violationService.js';

const MIX_COLORS = ['#f59e0b', '#ef4444', '#3b82f6'];

const formatDateTime = (dateInput) => {
  const date = new Date(dateInput);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDateKey = (dateInput) => {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getViolationCategory = (violation) => {
  if (violation.helmetViolation && violation.overloadingViolation) {
    return 'Both';
  }

  if (violation.helmetViolation) {
    return 'No Helmet';
  }

  if (violation.overloadingViolation) {
    return 'Overloading';
  }

  return 'Other';
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [violations, setViolations] = useState([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [statsResponse, violationsResponse] = await Promise.all([
        violationService.getStatistics(),
        violationService.getAllViolations(),
      ]);

      if (statsResponse?.success) {
        setStatistics(statsResponse.data);
      }

      if (violationsResponse?.success && Array.isArray(violationsResponse.data)) {
        setViolations(violationsResponse.data);
      } else {
        setViolations([]);
      }

      setError('');
    } catch (err) {
      setError('Unable to load dashboard analytics. Please check backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const todayViolations = useMemo(() => {
    const todayKey = getDateKey(new Date());
    return violations.filter((violation) => getDateKey(violation.violationDateTime) === todayKey).length;
  }, [violations]);

  const summaryCards = useMemo(() => {
    const totalViolations = Number(statistics?.totalViolations ?? violations.length);
    const helmetViolations = Number(
      statistics?.helmetViolations ?? violations.filter((item) => item.helmetViolation).length,
    );
    const overloadingViolations = Number(
      statistics?.overloadingViolations ?? violations.filter((item) => item.overloadingViolation).length,
    );
    const resolvedViolations = Number(
      statistics?.resolvedViolations ?? violations.filter((item) => item.status === 'RESOLVED').length,
    );
    const resolutionRate = totalViolations > 0 ? Math.round((resolvedViolations / totalViolations) * 100) : 0;

    return [
      {
        title: 'Total Violations',
        value: totalViolations,
        icon: AlertTriangle,
        tone: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
      },
      {
        title: 'Today',
        value: todayViolations,
        icon: Users,
        tone: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
      },
      {
        title: 'Helmet Violations',
        value: helmetViolations,
        icon: Shield,
        tone: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
      },
      {
        title: 'Overloading',
        value: overloadingViolations,
        icon: Users,
        tone: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
      },
      {
        title: 'Resolution Rate',
        value: `${resolutionRate}%`,
        icon: CheckCircle2,
        tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
      },
    ];
  }, [statistics, todayViolations, violations]);

  const trendData = useMemo(() => {
    const byDay = new Map();

    const latestViolationDate = violations.reduce((latest, violation) => {
      const candidate = new Date(violation.violationDateTime);
      if (Number.isNaN(candidate.getTime())) {
        return latest;
      }

      return candidate > latest ? candidate : latest;
    }, new Date(0));

    const baseDate = latestViolationDate.getTime() > 0 ? latestViolationDate : new Date();
    baseDate.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - i);
      const key = getDateKey(date);

      byDay.set(key, {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: 0,
      });
    }

    violations.forEach((violation) => {
      const key = getDateKey(violation.violationDateTime);
      if (!byDay.has(key)) {
        return;
      }

      const current = byDay.get(key);
      byDay.set(key, {
        ...current,
        total: current.total + 1,
      });
    });

    return Array.from(byDay.values());
  }, [violations]);

  const hasTrendValues = trendData.some((item) => item.total > 0);

  const statusData = useMemo(() => {
    const pending = Number(
      statistics?.pendingViolations ?? violations.filter((item) => item.status === 'PENDING').length,
    );
    const reviewed = Number(
      statistics?.reviewedViolations ?? violations.filter((item) => item.status === 'REVIEWED').length,
    );
    const resolved = Number(
      statistics?.resolvedViolations ?? violations.filter((item) => item.status === 'RESOLVED').length,
    );

    return [
      { label: 'Pending', value: pending },
      { label: 'Reviewed', value: reviewed },
      { label: 'Resolved', value: resolved },
    ];
  }, [statistics, violations]);

  const violationMixData = useMemo(() => {
    let noHelmetCount = 0;
    let overloadingCount = 0;
    let bothCount = 0;

    violations.forEach((violation) => {
      if (violation.helmetViolation && violation.overloadingViolation) {
        bothCount += 1;
      } else if (violation.helmetViolation) {
        noHelmetCount += 1;
      } else if (violation.overloadingViolation) {
        overloadingCount += 1;
      }
    });

    return [
      { name: 'No Helmet', value: noHelmetCount },
      { name: 'Overloading', value: overloadingCount },
      { name: 'Both', value: bothCount },
    ];
  }, [violations]);

  const locationData = useMemo(() => {
    const locationCount = {};

    violations.forEach((violation) => {
      const location = violation.location || 'Unknown';
      locationCount[location] = (locationCount[location] || 0) + 1;
    });

    return Object.entries(locationCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [violations]);

  const vehicleTypeData = useMemo(() => {
    const vehicleTypeCount = {};

    violations.forEach((violation) => {
      const type = violation.vehicleType || 'Unknown';
      vehicleTypeCount[type] = (vehicleTypeCount[type] || 0) + 1;
    });

    return Object.entries(vehicleTypeCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [violations]);

  const recentViolations = violations.slice(0, 6);

  return (
    <div className="space-y-6 text-gray-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-gray-400">
            Live traffic violation intelligence with multiple chart views.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-100 transition hover:border-blue-400/60 hover:bg-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className={`rounded-2xl border p-4 shadow-lg shadow-black/10 backdrop-blur ${card.tone}`}
            >
              <div className="flex items-start justify-between">
                <p className="text-xs uppercase tracking-wide text-gray-300">{card.title}</p>
                <Icon size={18} className="opacity-90" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-[#0b1222] p-5">
          <h2 className="text-lg font-semibold text-white">7-Day Violation Trend</h2>
          <p className="mt-1 text-xs text-gray-400">
            Daily totals for the latest 7-day window in available data
          </p>
          <div className="mt-5 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a40" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  allowDecimals={false}
                  domain={[0, (dataMax) => (dataMax < 1 ? 1 : dataMax + 1)]}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#0b1222' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {!hasTrendValues && (
            <p className="mt-2 text-xs text-slate-500">
              No violations found in the selected 7-day range.
            </p>
          )}
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#0b1222] p-5">
          <h2 className="text-lg font-semibold text-white">Violation Type Split</h2>
          <p className="mt-1 text-xs text-gray-400">No Helmet vs Overloading vs Both</p>
          <div className="mt-5 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationMixData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={92}
                  paddingAngle={3}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {violationMixData.map((entry, index) => (
                    <Cell key={entry.name} fill={MIX_COLORS[index % MIX_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#0b1222] p-5">
          <h2 className="text-lg font-semibold text-white">Status Distribution</h2>
          <p className="mt-1 text-xs text-gray-400">Current investigation and closure state</p>
          <div className="mt-5 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a40" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {statusData.map((entry) => {
                    const fillByStatus = {
                      Pending: '#fbbf24',
                      Reviewed: '#60a5fa',
                      Resolved: '#34d399',
                    };

                    return <Cell key={entry.label} fill={fillByStatus[entry.label]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#0b1222] p-5">
          <h2 className="text-lg font-semibold text-white">Top Violation Locations</h2>
          <p className="mt-1 text-xs text-gray-400">Most affected areas</p>
          <div className="mt-5 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a40" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={95}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
                <Bar dataKey="value" fill="#38bdf8" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-[#0b1222] p-5">
          <h2 className="text-lg font-semibold text-white">Violations by Vehicle Type</h2>
          <p className="mt-1 text-xs text-gray-400">Vehicle classes involved in violations</p>
          <div className="mt-5 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a40" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
                <Bar dataKey="value" fill="#a78bfa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-[#0b1222] p-5">
          <h2 className="text-lg font-semibold text-white">Recent Violations</h2>
          <p className="mt-1 text-xs text-gray-400">Latest recorded events</p>

          {recentViolations.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-700 bg-[#0f172a] p-4 text-sm text-gray-400">
              No violations available yet. Add data to populate charts and trend cards.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recentViolations.map((violation) => (
                <div
                  key={violation.id}
                  className="rounded-xl border border-slate-700 bg-[#0f172a] p-3 transition hover:border-slate-500"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-blue-200">{violation.vehicleNumber}</p>
                    <span className="rounded-full border border-slate-600 px-2 py-0.5 text-xs text-slate-200">
                      {violation.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-gray-400 sm:grid-cols-2">
                    <p>Type: {getViolationCategory(violation)}</p>
                    <p>Location: {violation.location}</p>
                    <p>Date: {formatDateTime(violation.violationDateTime)}</p>
                    <p>Passengers: {violation.passengerCount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      {!loading && violations.length === 0 && (
        <div className="rounded-xl border border-slate-700 bg-[#0f172a] p-4 text-sm text-gray-400">
          Charts are active but there is no violation data yet. Record a few violations to see meaningful trends.
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-slate-700 bg-[#0f172a] p-4 text-sm text-gray-300">
          Loading dashboard analytics...
        </div>
      )}
    </div>
  );
};

export default Dashboard;

