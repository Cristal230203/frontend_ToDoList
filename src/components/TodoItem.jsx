import React, { useState } from 'react';
import { PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/solid";

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
    <div className={`p-4 transition duration-300 group theme-transition ${
      isDark
        ? 'hover:bg-gradient-to-r hover:from-[#F0D9B5]/5 hover:to-[#E8C79E]/5'
        : 'hover:bg-gradient-to-r hover:from-[#F0D9B5]/5 hover:to-[#F1AAA9]/5'
    }`}>
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <button
          onClick={() => toggleCompleted(tarea._id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition duration-300 transform hover:scale-110 theme-transition ${
            tarea.completed
              ? isDark
                ? 'bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] border-[#F0D9B5]'
                : 'bg-gradient-to-r from-[#F0D9B5] to-[#E8C79E] border-[#F0D9B5]'
              : isDark
              ? 'border-[#F0D9B5]/30 hover:border-[#F0D9B5]/60'
              : 'border-[#E8DAEF] hover:border-[#F0D9B5]'
          }`}
        >
          {tarea.completed && <CheckIcon className={`w-4 h-4 ${isDark ? 'text-[#312C51]' : 'text-[#312C51]'}`} />}
        </button>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition theme-transition ${
                isDark
                  ? 'bg-[#2d2640] text-[#F0D9B5] border-[#F0D9B5]/40 focus:ring-[#F0D9B5]/60 focus:border-[#F0D9B5]/60'
                  : 'bg-white text-[#312C51] border-[#F0D9B5] focus:ring-[#F0D9B5]'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit();
                if (e.key === 'Escape') handleCancel();
              }}
            />
          ) : (
            <p className={`font-medium break-words transition duration-300 theme-transition ${
              tarea.completed
                ? isDark
                  ? 'line-through text-[#8B7D6B]'
                  : 'line-through text-[#4B426D]/50'
                : isDark
                ? 'text-[#F0D9B5]'
                : 'text-[#312C51]'
            }`}>
              {tarea.text}
            </p>
          )}
        </div>

        {/* Botones de acciones */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
          {isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className={`p-2 rounded-lg transition duration-300 transform hover:scale-110 ${
                  isDark
                    ? 'text-[#D4AF7A] hover:bg-[#D4AF7A]/20'
                    : 'text-green-500 hover:bg-green-100'
                }`}
              >
                ✓
              </button>
              <button
                onClick={handleCancel}
                className={`p-2 rounded-lg transition duration-300 transform hover:scale-110 ${
                  isDark
                    ? 'text-[#E8A89F] hover:bg-[#E8A89F]/20'
                    : 'text-red-500 hover:bg-red-100'
                }`}
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className={`p-2 rounded-lg transition duration-300 transform hover:scale-110 ${
                  isDark
                    ? 'text-[#E8C79E] hover:bg-[#E8C79E]/20'
                    : 'text-[#F0D9B5] hover:bg-[#F0D9B5]/10'
                }`}
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteTarea(tarea._id)}
                className={`p-2 rounded-lg transition duration-300 transform hover:scale-110 ${
                  isDark
                    ? 'text-[#E8A89F] hover:bg-[#E8A89F]/20'
                    : 'text-[#F1AAA9] hover:bg-[#F1AAA9]/10'
                }`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
