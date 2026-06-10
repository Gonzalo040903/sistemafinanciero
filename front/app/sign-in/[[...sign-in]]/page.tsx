import { SignIn } from '@clerk/nextjs';
import { Banknote } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="size-12 rounded-xl bg-primary/15 flex items-center justify-center">
          <Banknote className="size-6 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-foreground">FinancieraApp</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sistema de gestión de préstamos</p>
        </div>
      </div>
      <SignIn />
    </div>
  );
}
