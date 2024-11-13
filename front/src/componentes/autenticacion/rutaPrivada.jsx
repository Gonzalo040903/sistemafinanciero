import React from 'react';
import { Navigate } from 'react-router-dom';


export const RutaPrivada = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));


  return isAuthenticated ? children : <Navigate to="/" replace />;
};
