'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '@/lib/useApi';
import type { Cliente } from '@/types';

export default function EliminarCliente() {
  const api = useApi();
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const fetchClientes = () =>
    api.get<Cliente[]>('/api/clientes').then(r => setClientes(r.data)).catch(console.error);

  useEffect(() => { fetchClientes(); }, [api]);

  const eliminar = async (dni: string) => {
    if (!confirm('¿Eliminar este cliente y todos sus préstamos?')) return;
    try {
      await api.delete(`/api/clientes/${dni}`);
      toast.success('Cliente eliminado');
      fetchClientes();
    } catch {
      toast.error('Error al eliminar el cliente');
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-700 mb-6">Eliminar Cliente</h3>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">DNI</th>
              <th className="px-4 py-3">Dirección</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientes.map(c => (
              <tr key={c.dni} className="hover:bg-gray-50">
                <td className="px-4 py-3">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-3">{c.dni}</td>
                <td className="px-4 py-3">{c.direccion}</td>
                <td className="px-4 py-3">{c.telefono_personal}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => eliminar(c.dni)}
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
