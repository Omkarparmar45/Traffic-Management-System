import React, { useState, useEffect } from 'react';
import violationService from '../services/violationService.js';
import './AdminDashboard.css';

/**
 * Admin Dashboard Component
 * 
 * Displays statistics and overview of all traffic violations
 */
function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [recentViolations, setRecentViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load statistics
      const statsResponse = await violationService.getStatistics();
      if (statsResponse.success) {
        setStatistics(statsResponse.data);
      }

      // Load recent violations
      const violationsResponse = await violationService.getAllViolations();
      if (violationsResponse.success) {
        // Get only the 5 most recent
        setRecentViolations(violationsResponse.data.slice(0, 5));
      }

      setError('');
    } catch (err) {
      setError('Failed to load dashboard data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getViolationType = (violation) => {
    if (violation.helmetViolation && violation.overloadingViolation) {
      return 'Both';
    } else if (violation.helmetViolation) {
      return 'No Helmet';
    } else if (violation.overloadingViolation) {
      return 'Overloading';
    }
    return 'None';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📊 Admin Dashboard</h2>
        <button onClick={loadDashboardData} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Violations</h3>
              <p className="stat-number">{statistics.totalViolations}</p>
            </div>
          </div>

          <div className="stat-card helmet">
            <div className="stat-icon">🪖</div>
            <div className="stat-content">
              <h3>Helmet Violations</h3>
              <p className="stat-number">{statistics.helmetViolations}</p>
            </div>
          </div>

          <div className="stat-card overloading">
            <div className="stat-icon">⚖️</div>
            <div className="stat-content">
              <h3>Overloading Violations</h3>
              <p className="stat-number">{statistics.overloadingViolations}</p>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p className="stat-number">{statistics.pendingViolations}</p>
            </div>
          </div>

          <div className="stat-card reviewed">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <h3>Reviewed</h3>
              <p className="stat-number">{statistics.reviewedViolations}</p>
            </div>
          </div>

          <div className="stat-card resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Resolved</h3>
              <p className="stat-number">{statistics.resolvedViolations}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Violations */}
      <div className="recent-violations-section">
        <h3>Recent Violations</h3>
        {recentViolations.length === 0 ? (
          <div className="no-data">No violations recorded yet</div>
        ) : (
          <div className="recent-violations-list">
            {recentViolations.map((violation) => (
              <div key={violation.id} className="violation-card">
                <div className="violation-header">
                  <span className="vehicle-number">{violation.vehicleNumber}</span>
                  <span className={`status-badge status-${violation.status.toLowerCase()}`}>
                    {violation.status}
                  </span>
                </div>
                <div className="violation-details">
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span className="value">{getViolationType(violation)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span className="value">{violation.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Date:</span>
                    <span className="value">{formatDateTime(violation.violationDateTime)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Passengers:</span>
                    <span className={`value ${violation.passengerCount > 2 ? 'overload' : ''}`}>
                      {violation.passengerCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="safety-tips">
        <h3>🛡️ Road Safety Reminders</h3>
        <ul>
          <li>Always wear a helmet when riding a two-wheeler</li>
          <li>Maximum 2 persons allowed on a two-wheeler</li>
          <li>Follow traffic signals and road signs</li>
          <li>Maintain safe speed and distance</li>
          <li>Report violations to promote road safety</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
