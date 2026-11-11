import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('heritage_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize user from token on load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('heritage_token');
      if (storedToken) {
        try {
          const res = await authAPI.getProfile();
          if (res.data && res.data.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          localStorage.removeItem('heritage_token');
          localStorage.removeItem('heritage_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('heritage_token', receivedToken);
      localStorage.setItem('heritage_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      toast.success(`Welcome back, ${receivedUser.name}!`);
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async userData => {
    try {
      const res = await authAPI.register(userData);
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('heritage_token', receivedToken);
      localStorage.setItem('heritage_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      toast.success('Registration successful! Welcome to Heritage Learning Hub.');
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('heritage_token');
    localStorage.removeItem('heritage_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateUserProfile = async profileData => {
    try {
      const res = await authAPI.updateProfile(profileData);
      setUser(res.data.user);
      localStorage.setItem('heritage_user', JSON.stringify(res.data.user));
      toast.success('Profile updated successfully.');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
