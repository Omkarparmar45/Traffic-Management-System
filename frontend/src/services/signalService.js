import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/signals';

const signalService = {
  getAllSignals: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  setAllSignalsState: async (state) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/control`, { state });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  setSignalState: async (id, state) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${id}/control`, { state });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default signalService;
