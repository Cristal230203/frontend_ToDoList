import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { ThemeContext } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast('Las contraseñas no coinciden', 'error', 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      addToast('✅ ¡Cuenta creada! Iniciando sesión...', 'success', 2000);
      
      // Auto-login después de registro
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        login(loginData.user, loginData.token);
        navigate('/todos');
      } else {
        navigate('/login');
      }
    } catch (error) {
      addToast(error.message, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${

         'bg-gradient-to-br from-[#1a1825] via-[#2d2640] to-[#1a1825]' 
    }`}>
      <div className={`rounded-3xl shadow-2xl p-8 w-full max-w-md border ${
        isDark
          ? 'bg-gradient-to-r from-[#2d2640] to-[#3d3555] text-white border-[#F0D9B5]/10'
          : 'bg-gradient-to-r from-[#312C51] to-[#4B426D] text-white border-[#4B426D]/20'
      }`}>
        <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${
          isDark ? 'from-[#F0D9B5] to-[#E8C79E]' : 'from-white to-[#F0D9B5]'
        } bg-clip-text text-transparent`}>
          Registrarse
        </h1>
        <p className={`mb-6 ${isDark ? 'text-[#E8C79E]' : 'text-gray-300'}`}>
          Crea una cuenta para empezar a organizar tus tareas
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#F0D9B5]' : 'text-gray-200'}`}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_usuario"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                isDark
                  ? 'bg-[#2d2640]/60 text-[#F0D9B5] border-[#F0D9B5]/20 focus:ring-[#F0D9B5]/60 focus:border-[#F0D9B5]/60'
                  : 'bg-white/80 text-[#312C51] border-[#E8DAEF] focus:ring-[#F0D9B5]/60 focus:border-transparent'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#F0D9B5]' : 'text-gray-200'}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                isDark
                  ? 'bg-[#2d2640]/60 text-[#F0D9B5] border-[#F0D9B5]/20 focus:ring-[#F0D9B5]/60 focus:border-[#F0D9B5]/60'
                  : 'bg-white/80 text-[#312C51] border-[#E8DAEF] focus:ring-[#F0D9B5]/60 focus:border-transparent'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#F0D9B5]' : 'text-gray-200'}`}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                isDark
                  ? 'bg-[#2d2640]/60 text-[#F0D9B5] border-[#F0D9B5]/20 focus:ring-[#F0D9B5]/60 focus:border-[#F0D9B5]/60'
                  : 'bg-white/80 text-[#312C51] border-[#E8DAEF] focus:ring-[#F0D9B5]/60 focus:border-transparent'
              }`}
              minLength="6"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-[#F0D9B5]' : 'text-gray-200'}`}>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                isDark
                  ? 'bg-[#2d2640]/60 text-[#F0D9B5] border-[#F0D9B5]/20 focus:ring-[#F0D9B5]/60 focus:border-[#F0D9B5]/60'
                  : 'bg-white/80 text-[#312C51] border-[#E8DAEF] focus:ring-[#F0D9B5]/60 focus:border-transparent'
              }`}
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-bold rounded-lg transition duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] text-[#312C51] disabled:opacity-50'
                : 'bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] hover:from-[#E8C79E] hover:to-[#DEB887] text-[#312C51] disabled:opacity-50'
            }`}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className={`mt-6 text-center ${isDark ? 'text-[#E8C79E]' : 'text-gray-300'}`}>
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className={`font-bold hover:underline ${isDark ? 'text-[#F0D9B5]' : 'text-white'}`}>
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}
