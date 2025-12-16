import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Configuración de la API
const API_CONFIG = {
  BASE_URL: 'https://todolist-backend-2k8o.onrender.com/api',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Importante para manejar cookies si es necesario
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || 'Error en la autenticación',
          status: response.status
        };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return { 
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'No se pudo conectar al servidor. Inténtalo de nuevo más tarde.'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ name, email, password }),
        credentials: 'include' // Importante para manejar cookies si es necesario
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || 'Error en el registro',
          status: response.status
        };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return { 
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'No se pudo conectar al servidor. Inténtalo de nuevo más tarde.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');z
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};