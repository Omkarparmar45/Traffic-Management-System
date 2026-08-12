import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/roads';

const roadService = {
  getAllRoads: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addRoad: async (roadPayload) => {
    try {
      const response = await axios.post(API_BASE_URL, roadPayload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateRoadStatus: async (id, payload) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default roadService;
