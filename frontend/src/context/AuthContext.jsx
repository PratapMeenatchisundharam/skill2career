import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('s2c_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('s2c_token'));

  useEffect(() => {
    if (token) localStorage.setItem('s2c_token', token);
    else localStorage.removeItem('s2c_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('s2c_user', JSON.stringify(user));
    else localStorage.removeItem('s2c_user');
  }, [user]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (fullName, email, password) => {
    const { data } = await api.post('/auth/register', { fullName, email, password });
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
