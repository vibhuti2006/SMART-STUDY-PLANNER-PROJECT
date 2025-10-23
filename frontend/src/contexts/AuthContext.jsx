import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth useEffect: Checking token...');
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded payload:', payload);
        setUser(payload);
      } catch(err) {
        console.error('Token decode error:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
    console.log('Loading set to false, user:', user);
  }, []);

  const login = async (credentials) => {
  try {
    const { data } = await authAPI.login(credentials);
    console.log('Login response:', data);  // Keep for debug
    if (!data.success || !data.data?.token) {
      throw new Error(data.message || 'No token in response');
    }
    localStorage.setItem('token', data.data.token);  // FIXED: data.data.token
    setUser({
      id: data.data._id,
      email: data.data.email,
      name: data.data.name,  // Add name if needed
      // Add other fields like preferences if used
    });
    navigate('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.response?.data?.message || error.message || 'Login failed' };
  }
};

  const signup = async (userData) => {
  try {
    const { data } = await authAPI.signup(userData);
    console.log('Signup response:', data);  // ADD for debug
    if (!data.success || !data.data?.token) {
      throw new Error(data.message || 'No token in response');
    }
    localStorage.setItem('token', data.data.token);  // FIXED: data.data.token
    setUser({
      id: data.data._id,
      email: data.data.email,
      name: data.data.name,
    });
    navigate('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: error.response?.data?.message || error.message || 'Signup failed' };
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const value = { user, login, signup, logout, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};