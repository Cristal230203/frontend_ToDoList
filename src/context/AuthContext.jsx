import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setUser({ ...parsed, name: parsed.username || parsed.name || '' });
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const login = (userObj, token) => {
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('token', token);
    setUser({ ...userObj, name: userObj.username || userObj.name });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
