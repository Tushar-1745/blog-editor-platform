import axios from 'axios';

// Set base URL to backend API
axios.defaults.baseURL = 'http://localhost:5000';

// Register User
export const register = async (data) => {
    try {
        console.log("registered data is", data);
        const response = await axios.post('/api/auth/register', data);
        console.log("Registration response is", response.data);
        return response.data;
    } catch (err) {
        console.error("Registration error is", err);
        throw new Error(err.response?.data?.message || 'Registration failed');
    }
};

// Login User
export const login = async (data) => {
    try {
        console.log("logged in user data is", data);
        const response = await axios.post('/api/auth/login', data);
        console.log("Login response is", response.data);
        return response.data;  // includes token and user info
    } catch (err) {
        console.error("Login error is", err);
        throw new Error(err.response?.data?.message || 'Login failed');
    }
};
