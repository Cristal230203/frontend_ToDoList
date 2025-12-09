import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import TodoList from './pages/TodoList';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default function App(){
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/todos" 
          element={
            <ProtectedRoute>
              <TodoList />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/todos" replace />} />
      </Routes>
    </Router>
  );
}
