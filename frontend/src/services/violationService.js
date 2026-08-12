import axios from 'axios';

/**
 * API Service for Traffic Violation Management
 * 
 * Handles all HTTP requests to the backend REST API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/violations';

const violationService = {
  /**
   * Record a new violation
   */
  recordViolation: async (violationData) => {
    try {
      const response = await axios.post(API_BASE_URL, violationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get all violations
   */
  getAllViolations: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get violation by ID
   */
  getViolationById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Search violations by vehicle number
   */
  searchByVehicleNumber: async (vehicleNumber) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: { vehicleNumber }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get violations by status
   */
  getViolationsByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get helmet violations
   */
  getHelmetViolations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/helmet`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get overloading violations
   */
  getOverloadingViolations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/overloading`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update violation status
   */
  updateViolationStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a violation
   */
  deleteViolation: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get violation statistics
   */
  getStatistics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/summary`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default violationService;
