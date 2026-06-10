'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import {
  FaBars, FaTimes, FaChartBar, FaUserPlus, FaUserMinus,
  FaUserEdit, FaMoneyBillWave, FaUsers, FaSignOutAlt,
  FaChevronDown, FaChevronUp,
} from 'react-icons/fa';

const navLinks = [
  { href: '/panel', label: 'Panel de control', icon: <FaChartBar /> },
  {
    label: 'Gestión Clientes', icon: <FaUsers />,
    children: [
      { href: '/agregar-cliente',   label: 'Agregar Cliente',   icon: <FaUserPlus /> },
      { href: '/eliminar-cliente',  label: 'Eliminar Cliente',  icon: <FaUserMinus /> },
      { href: '/modificar-cliente', label: 'Modificar Cliente', icon: <FaUserEdit /> },
    ],
  },
  { href: '/nuevo-cobro', label: 'Nuevo Cobro', icon: <FaMoneyBillWave /> },
];

const activeStyle: React.CSSProperties = {
  color: '#a78bfa',
  background: 'rgba(139,92,246,0.15)',
  borderLeft: '3px solid #8b5cf6',
  boxShadow: 'inset 0 0 12px rgba(139,92,246,0.08)',
};

const inactiveStyle: React.CSSProperties = {
  color: 'rgba(203,213,225,0.75)',
  background: 'none',
  borderLeft: '3px solid transparent',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clientesOpen, setClientesOpen] = useState(false);

  const rol = (user?.publicMetadata as { rol?: string })?.rol;
  const isAdmin = rol === 'admin';
  const handleLogout = () => signOut({ redirectUrl: '/sign-in' });

  const linkStyle = (href: string): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.7rem 1.5rem',
    textDecoration: 'none', fontSize: '0.9rem',
    transition: 'all 0.15s',
    ...(pathname === href ? activeStyle : inactiveStyle),
  });

  const NavContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0.5rem 0' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(139,92,246,0.15)', marginBottom: '0.75rem' }}>
        <div style={{
          fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          FinancieraApp
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          {user?.username || user?.firstName || ''}
          {isAdmin && (
            <span style={{
              marginLeft: '0.5rem', fontSize: '0.65rem', fontWeight: 600,
              background: 'rgba(139,92,246,0.25)', color: '#a78bfa',
              padding: '1px 6px', borderRadius: '999px', border: '1px solid rgba(139,92,246,0.3)',
            }}>admin</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {navLinks.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => setClientesOpen(p => !p)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 1.5rem', background: 'none', border: 'none',
                  borderLeft: '3px solid transparent',
                  color: 'rgba(203,213,225,0.75)', cursor: 'pointer', fontSize: '0.9rem',
                }}
              >
                {item.icon} {item.label}
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.6 }}>
                  {clientesOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              {clientesOpen && item.children.map(child => (
                <Link key={child.href} href={child.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    ...linkStyle(child.href),
                    padding: '0.6rem 1.5rem 0.6rem 3rem',
                    fontSize: '0.85rem',
                  }}
                >
                  {child.icon} {child.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link key={item.href} href={item.href!}
              onClick={() => setMobileOpen(false)}
              style={linkStyle(item.href!)}
            >
              {item.icon} {item.label}
            </Link>
          )
        )}

        {isAdmin && (
          <Link href="/vendedores" onClick={() => setMobileOpen(false)} style={linkStyle('/vendedores')}>
            <FaUsers /> Vendedores
          </Link>
        )}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.9rem 1.5rem', background: 'none', border: 'none',
          borderTop: '1px solid rgba(139,92,246,0.12)',
          color: 'rgba(203,213,225,0.5)', cursor: 'pointer', fontSize: '0.85rem',
          transition: 'color 0.15s', width: '100%',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(203,213,225,0.5)')}
      >
        <FaSignOutAlt /> Cerrar sesión
      </button>
    </div>
  );

  const sidebarStyle: React.CSSProperties = {
    width: 240,
    background: 'var(--bg-surface)',
    borderRight: '1px solid rgba(139,92,246,0.12)',
    flexShrink: 0,
    height: '100vh',
    position: 'sticky',
    top: 0,
    overflowY: 'auto',
  };

  return (
    <>
      {/* Desktop */}
      <aside style={sidebarStyle} className="hidden md:block">
        <NavContent />
      </aside>

      {/* Mobile toggle */}
      <div className="md:hidden" style={{ position: 'fixed', top: 12, left: 12, zIndex: 1100 }}>
        <button
          onClick={() => setMobileOpen(p => !p)}
          style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 8, color: '#a78bfa',
            padding: '8px 10px', cursor: 'pointer', fontSize: '1.1rem',
          }}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
          />
          <aside style={{ ...sidebarStyle, position: 'fixed', top: 0, left: 0, zIndex: 1060 }}>
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}
