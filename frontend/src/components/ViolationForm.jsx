import React, { useState } from 'react';
import violationService from '../services/violationService.js';
import './ViolationForm.css';

/**
 * Violation Form Component
 * 
 * Allows users to record new traffic violations
 */
function ViolationForm({ onViolationRecorded }) {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Motorcycle',
    helmetViolation: false,
    overloadingViolation: false,
    passengerCount: 1,
    location: '',
    violationDateTime: '',
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'passengerCount') {
      const count = parseInt(value) || 1;
      setFormData(prev => ({
        ...prev,
        [name]: count,
        overloadingViolation: count > 2 ? true : prev.overloadingViolation
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await violationService.recordViolation(formData);
      
      if (response.success) {
        setMessage({ text: 'Violation recorded successfully!', type: 'success' });
        // Reset form
        setFormData({
          vehicleNumber: '',
          vehicleType: 'Motorcycle',
          helmetViolation: false,
          overloadingViolation: false,
          passengerCount: 1,
          location: '',
          violationDateTime: '',
          remarks: ''
        });
        
        if (onViolationRecorded) {
          onViolationRecorded();
        }
      }
    } catch (error) {
      setMessage({ 
        text: error.message || 'Failed to record violation. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="violation-form-container">
      <div className="form-card">
        <h2>📝 Record Traffic Violation</h2>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vehicleNumber">Vehicle Number *</label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g., ABC-1234"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleType">Vehicle Type *</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="Motorcycle">Motorcycle</option>
                <option value="Scooter">Scooter</option>
                <option value="Moped">Moped</option>
                <option value="Other Two-Wheeler">Other Two-Wheeler</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="passengerCount">Number of Persons *</label>
              <input
                type="number"
                id="passengerCount"
                name="passengerCount"
                value={formData.passengerCount}
                onChange={handleChange}
                min="1"
                max="10"
                required
              />
              {formData.passengerCount > 2 && (
                <small className="warning-text">⚠️ More than 2 persons - Overloading detected!</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main Street Junction"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="violationDateTime">Date & Time *</label>
            <input
              type="datetime-local"
              id="violationDateTime"
              name="violationDateTime"
              value={formData.violationDateTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="violation-checks">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="helmetViolation"
                name="helmetViolation"
                checked={formData.helmetViolation}
                onChange={handleChange}
              />
              <label htmlFor="helmetViolation">
                <span className="checkbox-label">🪖 No Helmet Violation</span>
                <small>Rider not wearing helmet</small>
              </label>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="overloadingViolation"
                name="overloadingViolation"
                checked={formData.overloadingViolation}
                onChange={handleChange}
              />
              <label htmlFor="overloadingViolation">
                <span className="checkbox-label">⚖️ Overloading Violation</span>
                <small>More than 2 persons on vehicle</small>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              placeholder="Additional notes or observations..."
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Recording...' : '✓ Record Violation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ViolationForm;
