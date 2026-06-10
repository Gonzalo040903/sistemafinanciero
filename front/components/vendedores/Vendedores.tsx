'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '@/lib/useApi';
import type { Vendedor } from '@/types';

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '0.875rem',
  boxShadow: 'var(--glow-purple)',
};

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.85rem',
  color: 'var(--text-primary)',
  outline: 'none',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  marginBottom: '0.25rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

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
    <div style={{ padding: '2rem', color: 'var(--text-primary)', maxWidth: '900px' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Gestión de Vendedores</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>Administrá usuarios del sistema</p>

      {/* Formulario nuevo */}
      <div style={{ ...card, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--purple-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
          Nuevo Vendedor
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ width: '180px' }}>
            <label style={labelStyle}>Nombre de usuario</label>
            <input style={inputStyle} value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>
          <div style={{ width: '180px' }}>
            <label style={labelStyle}>Contraseña</label>
            <input style={inputStyle} type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} />
          </div>
          <div style={{ width: '140px' }}>
            <label style={labelStyle}>Rol</label>
            <select style={inputStyle} value={rol} onChange={e => setRol(e.target.value as 'vendedor' | 'admin')}>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            onClick={crear}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              boxShadow: '0 0 14px rgba(124,58,237,0.3)',
              color: '#fff', fontWeight: 600,
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem',
              border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            }}
          >
            Crear
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ ...card, overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '0.83rem', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Rol', 'Creado', ''].map(h => (
                <th key={h} style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendedores.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-primary)', fontWeight: 500 }}>{v.nombre}</td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px',
                    background: v.rol === 'admin' ? 'rgba(248,113,113,0.12)' : 'rgba(139,92,246,0.15)',
                    color: v.rol === 'admin' ? '#f87171' : '#a78bfa',
                    border: `1px solid ${v.rol === 'admin' ? 'rgba(248,113,113,0.3)' : 'rgba(139,92,246,0.3)'}`,
                  }}>
                    {v.rol}
                  </span>
                </td>
                <td style={{ padding: '0.7rem 1rem', color: 'var(--text-secondary)' }}>
                  {new Date(v.creadoEn).toLocaleDateString('es-AR')}
                </td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <button
                    onClick={() => eliminar(v.id)}
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
