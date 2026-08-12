import React, { useState, useEffect } from 'react';
import violationService from '../services/violationService.js';
import './ViolationList.css';

/**
 * Violation List Component
 * 
 * Displays all recorded violations with filtering and management options
 */
function ViolationList() {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    loadViolations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [violations, searchTerm, filterStatus, filterType]);

  const loadViolations = async () => {
    try {
      setLoading(true);
      const response = await violationService.getAllViolations();
      if (response.success) {
        setViolations(response.data);
        setError('');
      }
    } catch (err) {
      setError('Failed to load violations. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...violations];

    // Search by vehicle number
    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(v => v.status === filterStatus);
    }

    // Filter by violation type
    if (filterType === 'HELMET') {
      filtered = filtered.filter(v => v.helmetViolation);
    } else if (filterType === 'OVERLOADING') {
      filtered = filtered.filter(v => v.overloadingViolation);
    }

    setFilteredViolations(filtered);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await violationService.updateViolationStatus(id, newStatus);
      if (response.success) {
        loadViolations();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this violation?')) {
      try {
        const response = await violationService.deleteViolation(id);
        if (response.success) {
          loadViolations();
        }
      } catch (err) {
        alert('Failed to delete violation');
      }
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
      return '🪖⚖️ Both';
    } else if (violation.helmetViolation) {
      return '🪖 No Helmet';
    } else if (violation.overloadingViolation) {
      return '⚖️ Overloading';
    }
    return 'None';
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'status-pending',
      REVIEWED: 'status-reviewed',
      RESOLVED: 'status-resolved'
    };
    return badges[status] || 'status-pending';
  };

  if (loading) {
    return (
      <div className="violation-list-container">
        <div className="loading">Loading violations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="violation-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="violation-list-container">
      <div className="list-header">
        <h2>📋 Traffic Violations</h2>
        <button onClick={loadViolations} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by vehicle number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="ALL">All</option>
            <option value="HELMET">Helmet</option>
            <option value="OVERLOADING">Overloading</option>
          </select>
        </div>
      </div>

      {/* Violations Count */}
      <div className="violations-count">
        Showing {filteredViolations.length} of {violations.length} violations
      </div>

      {/* Violations Table */}
      {filteredViolations.length === 0 ? (
        <div className="no-data">No violations found</div>
      ) : (
        <div className="table-container">
          <table className="violations-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle No.</th>
                <th>Type</th>
                <th>Violation</th>
                <th>Passengers</th>
                <th>Location</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((violation) => (
                <tr key={violation.id}>
                  <td>{violation.id}</td>
                  <td className="vehicle-number">{violation.vehicleNumber}</td>
                  <td>{violation.vehicleType}</td>
                  <td className="violation-type">{getViolationType(violation)}</td>
                  <td className={violation.passengerCount > 2 ? 'overload' : ''}>
                    {violation.passengerCount}
                  </td>
                  <td>{violation.location}</td>
                  <td>{formatDateTime(violation.violationDateTime)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(violation.status)}`}>
                      {violation.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <select
                      value={violation.status}
                      onChange={(e) => handleStatusChange(violation.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                    <button
                      onClick={() => handleDelete(violation.id)}
                      className="delete-button"
                      title="Delete violation"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViolationList;
