import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente de Ruta Privada
export const RutaPrivada = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si hay un token guardado.

  // Si el usuario está autenticado, renderiza el componente hijo, de lo contrario redirige al login
  return isAuthenticated ? children : <Navigate to="/" replace />;
};
