import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Define the functions first
const signupUser = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/signup`, { name, email, password });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

const getUserMails = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE}/mails/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch mails');
  }
};

const addEmail = async (userId, sender, subject, body) => {
  try {
    const res = await axios.post(`${API_BASE}/add-email`, { userId, sender, subject, body });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add email');
  }
};

// Export the functions
export { signupUser, loginUser, getUserMails, addEmail };
