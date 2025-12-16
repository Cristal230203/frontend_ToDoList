import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { ThemeContext } from '../context/ThemeContext';
import TodoItem from '../components/TodoItem';
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function TodoList() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  
  const { logout, user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate ? useNavigate() : { push: () => {} };

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTareas();
    setAnimateIn(true);
  }, []);

  const fetchTareas = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTareas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      addToast('Error al cargar tus tareas', 'error', 4000);
      setLoading(false);
    }
  };

  const tareasFiltradas = tareas.filter(tarea =>
    (tarea.text || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const addTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) {
      addToast('Por favor escribe una tarea', 'warning');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: nuevaTarea })
      });
      
      if (!response.ok) throw new Error('Error al crear tarea');
      
      const data = await response.json();
      setTareas([...tareas, data]);
      setNuevaTarea('');
      addToast('Tarea creada exitosamente', 'success', 3000);
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      addToast('Error al crear la tarea', 'error', 4000);
    }
  };

  const toggleCompleted = async (id) => {
    const tarea = tareas.find(t => t._id === id);
    
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !tarea.completed })
      });
      
      if (!response.ok) throw new Error('Error al actualizar tarea');
      
      const data = await response.json();
      setTareas(tareas.map(t => t._id === id ? data : t));
      
      if (!tarea.completed) {
        addToast('Tarea completada correctamente', 'success', 3000);
      } else {
        addToast('Tarea marcada como pendiente', 'info', 3000);
      }
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      addToast('Error al actualizar la tarea', 'error', 4000);
    }
  };

  const editTarea = async (id, nuevoTexto) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: nuevoTexto })
      });
      
      if (!response.ok) throw new Error('Error al editar tarea');
      
      const data = await response.json();
      setTareas(tareas.map(t => t._id === id ? data : t));
      addToast('Tarea editada correctamente', 'success', 3000);
    } catch (error) {
      console.error('Error al editar tarea:', error);
      addToast('Error al editar la tarea', 'error', 4000);
    }
  };

  const deleteTarea = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar tarea');
      
      setTareas(tareas.filter(t => t._id !== id));
      addToast('Tarea eliminada exitosamente', 'success', 3000);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      addToast('Error al eliminar la tarea', 'error', 4000);
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Sesión cerrada correctamente', 'info', 2000);
    setTimeout(() => { if (navigate && navigate('/login')){} }, 500);
  };

  const stats = {
    total: tareas.length,
    completed: tareas.filter(t => t.completed).length,
    pending: tareas.length - tareas.filter(t => t.completed).length
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${
            isDark ? 'border-blue-500' : 'border-indigo-600'
          }`}></div>
          <p className={`font-semibold text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Cargando tareas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-xl shadow-xl p-6 mb-8 transition-all duration-300 ${
          isDark
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Mis Tareas
              </h1>
              {user && (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Bienvenido, <span className="font-semibold">{user.username || user.name}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={toggleTheme} 
                className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Cambiar tema"
              >
                {isDark ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
              </button>
              <button 
                onClick={handleLogout} 
                className={`px-4 sm:px-6 py-2 font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/40 border border-red-800'
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-3 mt-6 pt-6 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`text-center p-4 rounded-lg transition-all duration-200 ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Total
              </p>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.total}
              </p>
            </div>
            <div className={`text-center p-4 rounded-lg transition-all duration-200 ${
              isDark ? 'bg-green-900/20' : 'bg-green-50'
            }`}>
              <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>
                Completadas
              </p>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>
                {stats.completed}
              </p>
            </div>
            <div className={`text-center p-4 rounded-lg transition-all duration-200 ${
              isDark ? 'bg-amber-900/20' : 'bg-amber-50'
            }`}>
              <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}>
                Pendientes
              </p>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`}>
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={addTarea} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              placeholder="Escribe una nueva tarea..."
              className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            <button 
              type="submit" 
              className={`px-6 sm:px-8 py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap ${
                isDark
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Agregar Tarea
            </button>
          </div>
        </form>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar tareas..."
              className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
          </div>
        </div>

        {/* List */}
        <div className={`rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}>
          {tareasFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <svg className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {busqueda 
                  ? 'No se encontraron tareas con ese término' 
                  : 'No hay tareas. Agrega una nueva para comenzar'}
              </p>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {tareasFiltradas.map((tarea) => (
                <TodoItem 
                  key={tarea._id}
                  tarea={tarea} 
                  toggleCompleted={toggleCompleted} 
                  deleteTarea={deleteTarea} 
                  editTarea={editTarea} 
                  isDark={isDark} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}