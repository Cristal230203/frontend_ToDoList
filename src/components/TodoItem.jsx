import React, { useState } from 'react';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function TodoItem({ tarea, toggleCompleted, deleteTarea, editTarea, isDark }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(tarea.text || '');

  const handleEdit = () => {
    if (editText.trim() && editText !== tarea.text) {
      editTarea(tarea._id, editText);
      setIsEditing(false);
    } else {
      setIsEditing(false);
      setEditText(tarea.text);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(tarea.text);
  };

  return (
    <div className={`px-6 py-4 flex items-center gap-4 border-b transition-all duration-300 group theme-transition ${
      isDark
        ? 'border-[#3d3555] hover:bg-[#3d3555]/40'
        : 'border-gray-200 hover:bg-gray-50'
    }`}>
      {/* Checkbox */}
      <button
        onClick={() => toggleCompleted(tarea._id)}
        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
          tarea.completed
            ? isDark
              ? 'bg-[#F0D9B5] border-[#F0D9B5]'
              : 'bg-[#312C51] border-[#312C51]'
            : isDark
            ? 'border-[#F0D9B5]/40 hover:border-[#F0D9B5]/80 hover:bg-[#F0D9B5]/10'
            : 'border-gray-300 hover:border-[#312C51] hover:bg-gray-100'
        }`}
        title="Marcar como completada"
      >
        {tarea.completed && (
          <CheckIcon className={`w-4 h-4 ${isDark ? 'text-[#2d2640]' : 'text-white'}`} />
        )}
      </button>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition theme-transition ${
              isDark
                ? 'bg-[#2d2640] text-[#F0D9B5] border-[#F0D9B5]/60 focus:ring-[#F0D9B5] focus:border-[#F0D9B5]'
                : 'bg-white text-[#312C51] border-[#F0D9B5] focus:ring-[#F0D9B5]/40 focus:border-[#F0D9B5]'
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <p className={`font-medium text-base break-words transition-all duration-300 theme-transition ${
            tarea.completed
              ? isDark
                ? 'line-through text-gray-500'
                : 'line-through text-gray-400'
              : isDark
              ? 'text-[#F0D9B5]'
              : 'text-[#312C51]'
          }`}>
            {tarea.text}
          </p>
        )}
      </div>

      {/* Botones de acciones */}
      <div className="flex gap-2 flex-shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleEdit}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? 'text-green-400 hover:bg-green-500/20 active:bg-green-500/30'
                  : 'text-green-600 hover:bg-green-100 active:bg-green-200'
              }`}
              title="Guardar cambios"
            >
              <CheckIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? 'text-red-400 hover:bg-red-500/20 active:bg-red-500/30'
                  : 'text-red-600 hover:bg-red-100 active:bg-red-200'
              }`}
              title="Cancelar edición"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? 'text-[#E8C79E] hover:bg-[#E8C79E]/20 active:bg-[#E8C79E]/30'
                  : 'text-[#F0D9B5] hover:bg-[#F0D9B5]/20 active:bg-[#F0D9B5]/30'
              }`}
              title="Editar tarea"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteTarea(tarea._id)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? 'text-red-400 hover:bg-red-500/20 active:bg-red-500/30'
                  : 'text-red-600 hover:bg-red-100 active:bg-red-200'
              }`}
              title="Eliminar tarea"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
