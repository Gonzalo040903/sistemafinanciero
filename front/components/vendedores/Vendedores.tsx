'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '@/lib/useApi';
import type { Vendedor } from '@/types';

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500';

export default function Vendedores() {
  const api = useApi();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState<'vendedor' | 'admin'>('vendedor');

  const fetchVendedores = () =>
    api.get<Vendedor[]>('/api/vendedores').then(r => setVendedores(r.data)).catch(() => {
      toast.error('Acceso denegado');
    });

  useEffect(() => { fetchVendedores(); }, [api]);

  const crear = async () => {
    if (!nombre || !contraseña) return toast.error('Completá nombre y contraseña');
    try {
      await api.post('/api/vendedores', { nombre, contraseña, rol });
      toast.success('Vendedor creado');
      setNombre('');
      setContraseña('');
      fetchVendedores();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al crear vendedor');
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este vendedor?')) return;
    try {
      await api.delete(`/api/vendedores/${id}`);
      toast.success('Vendedor eliminado');
      fetchVendedores();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-700 mb-6">Gestión de Vendedores</h3>

      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h5 className="font-semibold text-gray-700 mb-4">Nuevo Vendedor</h5>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-48">
            <label className="block text-xs text-gray-500 mb-1">Nombre de usuario</label>
            <input className={inputCls} value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div className="w-48">
            <label className="block text-xs text-gray-500 mb-1">Contraseña</label>
            <input className={inputCls} type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} />
          </div>
          <div className="w-36">
            <label className="block text-xs text-gray-500 mb-1">Rol</label>
            <select className={inputCls} value={rol} onChange={e => setRol(e.target.value as 'vendedor' | 'admin')}>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            onClick={crear}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Crear
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vendedores.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{v.nombre}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                    v.rol === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {v.rol}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(v.creadoEn).toLocaleDateString('es-AR')}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => eliminar(v.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
