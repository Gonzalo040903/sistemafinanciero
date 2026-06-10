'use client';

import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';
import axios from 'axios';

export function useApi() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const instance = axios.create();

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    instance.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err.response?.status === 401) window.location.href = '/sign-in';
        return Promise.reject(err);
      }
    );

    return instance;
  }, [getToken]);
}
