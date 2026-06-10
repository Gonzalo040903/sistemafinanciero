import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema Financiero',
  description: 'Gestión de préstamos y clientes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
