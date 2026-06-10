import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
});

// El interceptor de Clerk en el cliente inyecta el token de sesión
// Llamamos a getToken() del hook useAuth() desde los componentes,
// pero para server actions usamos el token directamente.
// Este helper se usa solo en componentes cliente ('use client').
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
