import { CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

function calcularFechasCuotas(fechaInicio: string, semanas: number): Date[] {
  const base = new Date(fechaInicio.slice(0, 10) + 'T12:00:00');
  return Array.from({ length: semanas }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + (i + 1) * 7);
    return d;
  });
}

function estadoCuota(fecha: Date, cuotasPagadas: number, index: number): 'pagada' | 'vencida' | 'proxima' | 'futura' {
  if (index < cuotasPagadas) return 'pagada';
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diff = fecha.getTime() - hoy.getTime();
  if (diff < 0) return 'vencida';
  if (diff < 7 * 24 * 60 * 60 * 1000) return 'proxima';
  return 'futura';
}

const estadoConfig = {
  pagada:  { dot: 'bg-green-400',              label: 'Pagada',  text: 'text-green-400' },
  vencida: { dot: 'bg-destructive animate-pulse', label: 'Vencida', text: 'text-destructive' },
  proxima: { dot: 'bg-yellow-400 animate-pulse', label: 'Próxima', text: 'text-yellow-400' },
  futura:  { dot: 'bg-muted-foreground/40',    label: '',        text: 'text-muted-foreground' },
};

interface Props {
  fechaInicio: string;
  semanas: number;
  cuotasPagadas?: number;
  montoCuota?: number;
}

export function CuotasPreview({ fechaInicio, semanas, cuotasPagadas = 0, montoCuota }: Props) {
  if (!fechaInicio || semanas < 1) return null;

  const fechas = calcularFechasCuotas(fechaInicio, semanas);
  const fmt = (d: Date) => d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest">
        <CalendarCheck className="size-3.5" />
        Cronograma de cuotas
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {fechas.map((fecha, i) => {
          const estado = estadoCuota(fecha, cuotasPagadas, i);
          const cfg = estadoConfig[estado];
          return (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 border',
                estado === 'vencida' ? 'border-destructive/30 bg-destructive/5' :
                estado === 'proxima' ? 'border-yellow-500/30 bg-yellow-500/5' :
                estado === 'pagada'  ? 'border-green-500/20 bg-green-500/5' :
                'border-border bg-transparent',
              )}
            >
              <span className={cn('size-2 rounded-full shrink-0', cfg.dot)} />
              <span className="text-xs text-muted-foreground w-5 shrink-0">C{i + 1}</span>
              <span className={cn('text-xs font-medium flex-1', cfg.text)}>{fmt(fecha)}</span>
              {montoCuota && (
                <span className="text-xs text-muted-foreground shrink-0">
                  ${montoCuota.toLocaleString('es-AR')}
                </span>
              )}
              {cfg.label && (
                <span className={cn('text-[10px] font-semibold uppercase shrink-0', cfg.text)}>
                  {cfg.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
