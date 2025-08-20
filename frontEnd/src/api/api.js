import axios from "axios";
import { localStorageToken } from "../url/urlConfig";
const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure this is the correct environment variable

// Function to get current token from localStorage
const getToken = () => {
    return localStorageToken;
};

// Helper function to construct the API URL without double slashes
const constructApiUrl = (baseUrl, routeEndpoint) => {
    return `${baseUrl.replace(/\/+$/, "")}/${routeEndpoint.replace(/^\/+/, "")}`;
};

// 🔐 Create API
const createApi = async (routeEndpoint, data) => {
    try {
        const token = getToken();
        const API_ENDPOINT = constructApiUrl(BASE_URL, routeEndpoint);
        if (!token) {
            // For login/register endpoints, make request without auth
            const response = await axios.post(`${API_ENDPOINT}`, data);
            return response.data;
        }
        const response = await axios.post(`${API_ENDPOINT}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Create API failed" };
    }
};

// 🔍 Get All API
const getApi = async (routeEndpoint) => {
    try {
        const token = getToken();
        if (!token) {
            throw { message: "Please sign in to view this content" };
        }
        const API_ENDPOINT = constructApiUrl(BASE_URL, routeEndpoint);
        const response = await axios.get(`${API_ENDPOINT}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        // Return user-friendly error messages
        if (error.response?.status === 401) {
            throw { message: "Your session has expired. Please sign in again." };
        }
        if (error.response?.status === 403) {
            throw { message: "You don't have permission to access this content." };
        }
        throw error.response?.data || { message: "Unable to load content. Please try again." };
    }
};

// 🔍 Get API by ID
const getApiById = async (routeEndpoint, id) => {
    try {
        const token = getToken();
        if (!token) {
            throw { message: "Please sign in to view this content" };
        }
        const API_ENDPOINT = constructApiUrl(BASE_URL, routeEndpoint);
        const response = await axios.get(`${API_ENDPOINT}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        // Return user-friendly error messages
        if (error.response?.status === 401) {
            throw { message: "Your session has expired. Please sign in again." };
        }
        if (error.response?.status === 403) {
            throw { message: "You don't have permission to access this content." };
        }
        throw error.response?.data || { message: "Unable to load content. Please try again." };
    }
};

// 🔄 Update API (now uses PATCH)
const updateApi = async (routeEndpoint, data = {}) => {
    try {
        const token = getToken();
        if (!token) {
            throw { message: "Authentication required" };
        }
        const API_ENDPOINT = constructApiUrl(BASE_URL, routeEndpoint);
        const response = await axios.patch(`${API_ENDPOINT}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        // Throw the full error object for better error handling in UI
        throw error.response?.data ? { ...error.response.data } : { message: "Update API failed" };
    }
};

// 🔄 Update API by ID
const updateApiById = async (routeEndpoint, id, data) => {
    try {
        const token = getToken();
        if (!token) {
            throw { message: "Authentication required" };
        }
        const API_ENDPOINT = constructApiUrl(BASE_URL, routeEndpoint);
        const response = await axios.patch(`${API_ENDPOINT}/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        // Throw the full error object for better error handling in UI
        throw error.response?.data ? { ...error.response.data } : { message: "Update API by ID failed" };
    }
};

// 🗑️ Delete API
const deleteApi = async (routeEndpoint) => {
    try {
        const token = getToken();
        if (!token) {
            throw { message: "Authentication required" };
        }
        const API_ENDPOINT = constructApiUrl(BASE_URL, routeEndpoint);
        const response = await axios.delete(`${API_ENDPOINT}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Delete API failed" };
    }
};

// 🗑️ Delete API by ID
const deleteApiById = async (routeEndpoint, id) => {
    try {
        const token = getToken();
        if (!token) {
            throw { message: "Authentication required" };
        }
        const API_ENDPOINT = constructApiUrl(BASE_URL, routeEndpoint);
        const response = await axios.delete(`${API_ENDPOINT}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Delete API by ID failed" };
    }
};

const deleteApiByCondition = async (routeEndpoint, id, data) => {
    try {
        const token = getToken();
        if (!token) {
            throw { message: "Authentication required" };
        }
        console.log("Data being sent:", data);
        const apiUrl = constructApiUrl(
            BASE_URL,
            `${routeEndpoint}/${id}`
        );
        const response = await axios.delete(apiUrl, {
            headers: { Authorization: `Bearer ${token}` },
            data: { data: data }, // Send JSON body in DELETE request
        });
        return response.data;
    } catch (error) {
        console.error("Delete API Error:", error);
        throw error.response?.data || { message: "Delete API by ID failed" };
    }
};

// 🚪 Logout function to clear token
const logout = () => {
    localStorage.removeItem("token");
};

export {
    createApi,
    getApi,
    getApiById,
    updateApi,
    updateApiById,
    deleteApi,
    deleteApiById,
    deleteApiByCondition,
    logout,
};
