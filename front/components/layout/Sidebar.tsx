'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import {
  LayoutDashboard, UserPlus, UserMinus, UserCog,
  DollarSign, Users, LogOut, Menu, ChevronDown, ChevronRight,
  Banknote, BarChart2, CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/panel',      label: 'Panel de control', icon: LayoutDashboard },
  { href: '/balance',    label: 'Balance',           icon: BarChart2 },
  { href: '/calendario', label: 'Calendario',        icon: CalendarDays },
  {
    label: 'Gestión Clientes', icon: Users,
    children: [
      { href: '/agregar-cliente',   label: 'Agregar Cliente',   icon: UserPlus },
      { href: '/eliminar-cliente',  label: 'Eliminar Cliente',  icon: UserMinus },
      { href: '/modificar-cliente', label: 'Modificar Cliente', icon: UserCog },
    ],
  },
  { href: '/nuevo-cobro', label: 'Cobros', icon: DollarSign },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [clientesOpen, setClientesOpen] = useState(false);

  const rol = (user?.publicMetadata as { rol?: string })?.rol;
  const isAdmin = rol === 'admin';

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (children: { href: string }[]) => children.some(c => pathname === c.href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border mb-2">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Banknote className="size-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-foreground">FinancieraApp</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              {user?.username || user?.firstName || ''}
              {isAdmin && (
                <Badge variant="default" className="text-[10px] py-0 px-1.5 h-4">admin</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5">
        {navLinks.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => setClientesOpen(p => !p)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                  isGroupActive(item.children)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                )}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {clientesOpen
                  ? <ChevronDown className="size-3.5 opacity-60" />
                  : <ChevronRight className="size-3.5 opacity-60" />
                }
              </button>
              {clientesOpen && (
                <div className="ml-4 mt-0.5 space-y-0.5 pl-3 border-l border-border">
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                        isActive(child.href)
                          ? 'text-primary bg-primary/10 font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                      )}
                    >
                      <child.icon className="size-3.5 shrink-0" />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                isActive(item.href!)
                  ? 'text-primary bg-primary/10 font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        )}

        {isAdmin && (
          <Link
            href="/vendedores"
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
              isActive('/vendedores')
                ? 'text-primary bg-primary/10 font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            )}
          >
            <Users className="size-4 shrink-0" />
            Vendedores
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 border-r border-border bg-sidebar overflow-y-auto">
        <NavContent />
      </aside>

      {/* Mobile: hamburger + sheet */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[240px] max-w-[240px]">
            <NavContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
