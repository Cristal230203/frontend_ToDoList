import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) {
      try {
        const parsed = JSON.parse(u);
        setUser({ ...parsed, name: parsed.username || parsed.name || "" });
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const login = (userObj, token) => {
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("token", token);
    setUser({ ...userObj, name: userObj.username || userObj.name });
  };

  // ⭐ CORREGIDO: Cambiar 'name' por 'username'
  const register = async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }), // ← Cambiado de 'name' a 'username'
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "Error en el registro",
        };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true, data };
    } catch (error) {
      console.error("Error en register:", error);
      return { success: false, error: "Error de conexión" };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}