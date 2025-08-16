import axios from "axios";
import handleTokenError from "./handleTokenError";

const getToken = () => localStorage.getItem("jwtToken");

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getRequest = async (url, navigate) => {
  try {
    const response = await axios.get(url, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleTokenError(error, navigate);
    throw error;
  }
};

export const postRequest = async (url, data, navigate) => {
  try {
    const response = await axios.post(url, data, { headers: getHeaders() });
    console.log("response", response);
    return response.data;
  } catch (error) {
    handleTokenError(error, navigate);
    throw error;
  }
};

export const deleteRequest = async (url, navigate) => {
  try {
    const response = await axios.delete(url, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleTokenError(error, navigate);
    throw error;
  }
};

export const updateRequest = async (url, data, navigate) => {
  try {
    const response = await axios.put(url, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleTokenError(error, navigate);
    throw error;
  }
};

export const updatePaymentExpectedDate = async (url, data, navigate) => {
  try {
    const response = await axios.put(url, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleTokenError(error, navigate);
    throw error;
  }
};
