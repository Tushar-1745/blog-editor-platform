import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setLoggedInUser(storedUser);
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [loggedInUser]);

  const login = (userData) => {
    setLoggedInUser(userData);
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('token'); // Also clear token on logout
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
