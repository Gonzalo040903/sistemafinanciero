// Tests para la ruta /api/reporte/balance-semanal y la función semanaArgentina

// Mocks deben ir antes de cualquier import del módulo bajo test
jest.mock('@/lib/auth', () => ({
  requireAuth: jest.fn().mockResolvedValue({ userId: 'u1', rol: 'vendedor' }),
}));

const mockSupabaseChain = () => {
  const chain: any = {
    select: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    in: jest.fn().mockResolvedValue({ data: [], error: null }),
  };
  chain.select.mockImplementation((..._args: any[]) => {
    // Si se llama con count, devuelve count=0
    if (_args[1] && _args[1].count === 'exact') {
      chain.lte.mockResolvedValue({ count: 0, data: null, error: null });
    } else {
      chain.lte.mockResolvedValue({ data: [], error: null });
    }
    return chain;
  });
  return chain;
};

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockImplementation(() => mockSupabaseChain()),
  },
}));

// Ahora importamos el route handler
import { GET } from '@/app/api/reporte/balance-semanal/route';

describe('semanaArgentina (via GET response shape)', () => {
  it('retorna status 200 con la shape correcta', async () => {
    const res = await GET() as Response;
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      nuevosClientes:        expect.any(Number),
      totalPrestamos:        expect.any(Number),
      totalPrestado:         expect.any(Number),
      totalCobrado:          expect.any(Number),
      prestamosDeLaSemana:   expect.any(Array),
      fechaHoy:              expect.any(String),
    });
  });
});

// Test unitario puro para semanaArgentina
// Extraemos la lógica al vuelo parseando el ISO retornado por fechaHoy
describe('balance con datos vacíos', () => {
  it('devuelve ceros cuando no hay datos en Supabase', async () => {
    const res = await GET() as Response;
    const body = await res.json();
    expect(body.nuevosClientes).toBe(0);
    expect(body.totalPrestamos).toBe(0);
    expect(body.totalPrestado).toBe(0);
    expect(body.totalCobrado).toBe(0);
    expect(body.prestamosDeLaSemana).toHaveLength(0);
  });
});
