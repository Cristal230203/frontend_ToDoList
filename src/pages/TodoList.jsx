import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

// Iconos SVG personalizados
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const MagnifyingGlassIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
);

// Componente TodoItem mejorado
function TodoItem({ tarea, toggleCompleted, deleteTarea, editTarea, updateTime, isDark }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(tarea.text);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleSave = () => {
    if (editText.trim()) {
      editTarea(tarea._id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(tarea.text);
    setIsEditing(false);
  };

  const handleTimeSubmit = () => {
    const timeInMinutes = (hours * 60) + minutes;
    updateTime(tarea._id, timeInMinutes);
    setShowTimeModal(false);
    setHours(0);
    setMinutes(0);
  };

  const formatTime = (minutes) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <>
      <div className={`p-4 transition-all duration-200 hover:shadow-md ${
        isDark 
          ? 'hover:bg-gray-750 bg-gray-800' 
          : 'hover:bg-gray-50 bg-white'
      }`}>
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => toggleCompleted(tarea._id)}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              tarea.completed
                ? isDark
                  ? 'bg-green-600 border-green-600'
                  : 'bg-green-500 border-green-500'
                : isDark
                ? 'border-gray-600 hover:border-green-500'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {tarea.completed && <CheckIcon />}
          </button>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'
                  }`}
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                />
                <button
                  onClick={handleSave}
                  className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <CheckIcon />
                </button>
                <button
                  onClick={handleCancel}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <XMarkIcon />
                </button>
              </div>
            ) : (
              <>
                <p className={`text-base font-medium break-words ${
                  tarea.completed
                    ? isDark
                      ? 'text-gray-500 line-through'
                      : 'text-gray-400 line-through'
                    : isDark
                    ? 'text-gray-100'
                    : 'text-gray-800'
                }`}>
                  {tarea.text}
                </p>
                {tarea.estimatedTime && (
                  <div className={`flex items-center gap-1 mt-2 ${
                    isDark ? 'text-blue-400' : 'text-indigo-600'
                  }`}>
                    <ClockIcon />
                    <span className="text-sm font-medium">
                      {formatTime(tarea.estimatedTime)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Botones de acción */}
          {!isEditing && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setShowTimeModal(true)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-blue-800'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                }`}
                title="Agregar tiempo estimado"
              >
                <ClockIcon />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? 'bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 border border-amber-800'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
                }`}
                title="Editar tarea"
              >
                <PencilIcon />
              </button>
              <button
                onClick={() => deleteTarea(tarea._id)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800'
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
                title="Eliminar tarea"
              >
                <TrashIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de tiempo */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl p-6 max-w-sm w-full ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Tiempo Estimado
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Horas
                </label>
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Minutos
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'
                  }`}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleTimeSubmit}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowTimeModal(false)}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TodoList() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [user] = useState({ username: 'Usuario' });

  useEffect(() => {
    // Simulación de carga de tareas
    setTimeout(() => {
      setTareas([
        { _id: '1', text: 'Ejemplo de tarea completada', completed: true, estimatedTime: 30 },
        { _id: '2', text: 'Ejemplo de tarea pendiente con tiempo estimado', completed: false, estimatedTime: 120 },
        { _id: '3', text: 'Otra tarea de ejemplo', completed: false }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const tareasFiltradas = tareas.filter(tarea =>
    (tarea.text || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const addTarea = (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) {
      alert('Por favor escribe una tarea');
      return;
    }

    const newTarea = {
      _id: Date.now().toString(),
      text: nuevaTarea,
      completed: false
    };
    
    setTareas([...tareas, newTarea]);
    setNuevaTarea('');
  };

  const toggleCompleted = (id) => {
    setTareas(tareas.map(t => 
      t._id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const editTarea = (id, nuevoTexto) => {
    setTareas(tareas.map(t => 
      t._id === id ? { ...t, text: nuevoTexto } : t
    ));
  };

  const updateTime = (id, timeInMinutes) => {
    setTareas(tareas.map(t => 
      t._id === id ? { ...t, estimatedTime: timeInMinutes } : t
    ));
  };

  const deleteTarea = (id) => {
    setTareas(tareas.filter(t => t._id !== id));
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
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
          ? 'bg-gray-900' 
          : 'bg-gray-50'
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
        ? 'bg-gray-900'
        : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 ${
          isDark
            ? 'bg-gray-800'
            : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold mb-2 ${
                isDark 
                  ? 'text-white' 
                  : 'text-gray-900'
              }`}>
                Mis Tareas
              </h1>
              {user && (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Bienvenido, <span className="font-semibold">{user.username}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={toggleTheme} 
                className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title="Cambiar tema"
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
              <button 
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                    // Aquí puedes agregar tu lógica de logout
                    // Por ejemplo: localStorage.removeItem('token');
                    // window.location.href = '/login';
                    alert('Sesión cerrada');
                  }
                }}
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
              isDark ? 'bg-gray-700' : 'bg-gray-100'
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
              isDark ? 'bg-gray-700' : 'bg-gray-100'
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
              isDark ? 'bg-gray-700' : 'bg-gray-100'
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
        <div className="mb-8">
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
              onKeyPress={(e) => e.key === 'Enter' && addTarea(e)}
            />
            <button 
              onClick={addTarea}
              className={`px-6 sm:px-8 py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap ${
                isDark
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Agregar Tarea
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <MagnifyingGlassIcon />
            </div>
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
        <div className={`rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-gray-800'
            : 'bg-white'
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
                  updateTime={updateTime}
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