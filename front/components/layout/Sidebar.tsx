'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { FaBars, FaTimes, FaChartBar, FaUserPlus, FaUserMinus, FaUserEdit, FaMoneyBillWave, FaUsers, FaSignOutAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clientesOpen, setClientesOpen] = useState(false);

  const rol = (user?.publicMetadata as { rol?: string })?.rol;
  const isAdmin = rol === 'admin';

  const handleLogout = () => signOut({ redirectUrl: '/sign-in' });

  const NavContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem 0' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
        <h5 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>💰 Financiera</h5>
        <small style={{ color: 'rgba(255,255,255,0.6)' }}>{user?.username}</small>
      </div>

      <nav style={{ flex: 1 }}>
        {navLinks.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => setClientesOpen(p => !p)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1.5rem', background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: '0.95rem',
                }}
              >
                {item.icon} {item.label}
                <span style={{ marginLeft: 'auto' }}>{clientesOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
              </button>
              {clientesOpen && item.children.map(child => (
                <Link key={child.href} href={child.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.6rem 1.5rem 0.6rem 3rem',
                    color: pathname === child.href ? '#15b1e5' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none', fontSize: '0.9rem',
                    background: pathname === child.href ? 'rgba(21,177,229,0.1)' : 'none',
                  }}
                >
                  {child.icon} {child.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link key={item.href} href={item.href!}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: pathname === item.href ? '#15b1e5' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                background: pathname === item.href ? 'rgba(21,177,229,0.1)' : 'none',
                borderLeft: pathname === item.href ? '3px solid #15b1e5' : '3px solid transparent',
              }}
            >
              {item.icon} {item.label}
            </Link>
          )
        )}

        {isAdmin && (
          <Link href="/vendedores" onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1.5rem',
              color: pathname === '/vendedores' ? '#15b1e5' : 'rgba(255,255,255,0.85)',
              textDecoration: 'none',
              background: pathname === '/vendedores' ? 'rgba(21,177,229,0.1)' : 'none',
              borderLeft: pathname === '/vendedores' ? '3px solid #15b1e5' : '3px solid transparent',
            }}
          >
            <FaUsers /> Vendedores
          </Link>
        )}
      </nav>

      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem 1.5rem', background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.95rem',
          borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%',
        }}
      >
        <FaSignOutAlt /> Cerrar sesión
      </button>
    </div>
  );

  const sidebarStyle: React.CSSProperties = {
    width: 240,
    background: '#1a1a2e',
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
            background: '#1a1a2e', border: 'none', borderRadius: 8,
            color: '#fff', padding: '8px 10px', cursor: 'pointer', fontSize: '1.2rem',
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
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          />
          <aside style={{ ...sidebarStyle, position: 'fixed', top: 0, left: 0, zIndex: 1060 }}>
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}
