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
      addToast('✨ ¡Tarea creada exitosamente!', 'success', 3000);
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
        addToast('✅ ¡Tarea completada! ¡Felicitaciones!', 'success', 3000);
      } else {
        addToast('↩️ Tarea marcada como pendiente', 'info', 3000);
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
      addToast('📝 Tarea editada correctamente', 'success', 3000);
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
      addToast('🗑️ Tarea eliminada exitosamente', 'success', 3000);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      addToast('Error al eliminar la tarea', 'error', 4000);
    }
  };

  const handleLogout = () => {
    logout();
    addToast('👋 ¡Hasta luego!', 'info', 2000);
    setTimeout(() => { if (navigate && navigate('/login')){} }, 500);
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen theme-transition ${
        isDark 
          ? 'bg-gradient-to-br from-[#1a1825] via-[#2d2640] to-[#1a1825]' 
          : 'bg-gradient-to-br from-[#FDF6F0] via-[#F5EBE0] to-[#ECE4D8]'
      }`}>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${
            isDark
              ? 'from-[#F0D9B5] to-[#F1AAA9]'
              : 'from-[#312C51] to-[#4B426D]'
          } mx-auto mb-4 float-animation shadow-2xl`}></div>
          <p className={`font-bold text-lg ${isDark ? 'text-[#F0D9B5]' : 'text-[#312C51]'}`}>
            Cargando tus tareas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Inline styles omitted for brevity (kept in original code). */}

      <div className={`min-h-screen py-8 px-4 relative overflow-hidden theme-transition ${
        isDark
          ? 'bg-gradient-to-br from-[#1a1825] via-[#2d2640] to-[#1a1825]'
          : 'bg-gradient-to-br from-[#FDF6F0] via-[#F5EBE0] to-[#ECE4D8]'
      }`}>
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header */}
          <div className={`rounded-3xl shadow-2xl p-8 mb-8 animate-in border theme-transition ${
            isDark
              ? 'bg-gradient-to-r from-[#2d2640] to-[#3d3555] text-white border-[#F0D9B5]/10'
              : 'bg-gradient-to-r from-[#312C51] to-[#4B426D] text-white border-[#4B426D]/20'
          }`}> 
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className={`text-5xl font-bold mb-2 bg-gradient-to-r ${
                  isDark
                    ? 'from-[#F0D9B5] to-[#E8C79E]'
                    : 'from-white to-[#F0D9B5]'
                } bg-clip-text text-transparent`}>
                  Mis Tareas
                </h1>
                {user && (
                  <p className={`text-lg ${isDark ? 'text-[#E8C79E]' : 'text-gray-300'}`}>
                    ¡Hola, <span className={`font-bold text-xl ${isDark ? 'text-[#F0D9B5]' : 'text-[#F0D9B5]'}`}>
                      {user.name}
                    </span>! 👋
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={toggleTheme} className="p-3 rounded-full">{isDark? <SunIcon className="w-6 h-6"/>: <MoonIcon className="w-6 h-6"/>}</button>
                <button onClick={handleLogout} className="px-6 py-3 font-bold rounded-full">Cerrar Sesión</button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={addTarea} className={`mb-8 animate-form theme-transition ${animateIn ? '' : 'opacity-0'}`}>
            <div className="flex gap-3">
              <input
                type="text"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                placeholder="✨ Agregar nueva tarea..."
                className="flex-1 px-6 py-4 border-2 rounded-2xl"
              />
              <button type="submit" className="px-8 py-4 font-bold rounded-2xl">Agregar</button>
            </div>
          </form>

          {/* List */}
          <div className={`rounded-3xl shadow-2xl overflow-hidden border-2 animate-list backdrop-blur-sm theme-transition ${animateIn ? '' : 'opacity-0'}`}>
            {tareasFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                  <span className="text-4xl">📝</span>
                </div>
                <p className={`text-lg font-semibold`}>{busqueda ? '❌ No se encontraron tareas con ese término' : '✅ No hay tareas. ¡Agrega una nueva!'}</p>
              </div>
            ) : (
              <div className={`divide-y`}>
                {tareasFiltradas.map((tarea, index) => (
                  <div key={tarea._id} style={{ animation: `slideInUp 0.5s ease-out ${index * 0.1}s forwards`, opacity: 0 }}>
                    <TodoItem tarea={tarea} toggleCompleted={toggleCompleted} deleteTarea={deleteTarea} editTarea={editTarea} isDark={isDark} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
