import { api } from "./api";

/**
 * Reusable request helper wrapping Axios calls for the PMAI application.
 * Handles both JSON payloads and Multipart Form Data (like assessor CV uploads).
 */
export const request = {
  async get(url, params = {}, config = {}) {
    try {
      const response = await api.get(url, { ...config, params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};

// Global error mapper
function handleError(error) {
  const errMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Terjadi kesalahan pada server.";
  throw new Error(errMsg);
}
