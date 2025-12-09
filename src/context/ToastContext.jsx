import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', timeout = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter(x => x.id !== id));
    }, timeout);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(0,0,0,0.8)', color: 'white', borderRadius: 6 }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
