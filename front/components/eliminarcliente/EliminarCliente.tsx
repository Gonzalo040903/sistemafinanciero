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

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '0.875rem',
    boxShadow: 'var(--glow-purple)',
    overflowX: 'auto',
  };

  return (
    <div className="p-6" style={{ color: 'var(--text-primary)' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Eliminar Cliente</h3>
      <div style={card}>
        <table style={{ width: '100%', fontSize: '0.83rem', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Nombre', 'DNI', 'Dirección', 'Teléfono', ''].map(h => (
                <th key={h} style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.dni} style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-primary)' }}>{c.nombre} {c.apellido}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.dni}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.direccion}</td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>{c.telefono_personal}</td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <button
                    onClick={() => eliminar(c.dni)}
                    style={{
                      background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                      color: '#f87171', fontSize: '0.75rem', padding: '0.3rem 0.75rem',
                      borderRadius: '0.4rem', cursor: 'pointer', fontWeight: 600,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
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
