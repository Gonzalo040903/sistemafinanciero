import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente de Ruta Privada
export const RutaPrivada = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  
  // Redirige al login si no está autenticado
  return isAuthenticated ? children : <Navigate to="/" replace />;
};
