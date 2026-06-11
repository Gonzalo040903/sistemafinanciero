-- Run this in Supabase SQL Editor (Database > SQL Editor > New query)

CREATE TABLE clientes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       TEXT NOT NULL,
  apellido     TEXT NOT NULL,
  dni          TEXT UNIQUE NOT NULL,
  direccion    TEXT NOT NULL,
  google_maps  TEXT,
  telefono_personal    TEXT NOT NULL,
  telefono_referencia  TEXT,
  telefono_tres        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prestamos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id     UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  monto          NUMERIC(12,2) NOT NULL,
  monto_final    NUMERIC(12,2) NOT NULL,
  monto_adeudado NUMERIC(12,2) NOT NULL,
  cuotas_totales INTEGER NOT NULL,
  cuotas_pagadas INTEGER DEFAULT 0,
  semanas        INTEGER NOT NULL,
  intereses      NUMERIC(5,2) NOT NULL,
  solo_interes   BOOLEAN DEFAULT FALSE,
  fecha_inicio   TIMESTAMPTZ NOT NULL,
  vendedor       TEXT NOT NULL,
  activo         BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pagos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestamo_id UUID NOT NULL REFERENCES prestamos(id) ON DELETE CASCADE,
  fecha       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  monto       NUMERIC(12,2) NOT NULL
);

CREATE INDEX idx_clientes_dni        ON clientes(dni);
CREATE INDEX idx_prestamos_cliente   ON prestamos(cliente_id);
CREATE INDEX idx_prestamos_activo    ON prestamos(activo);
CREATE INDEX idx_pagos_prestamo      ON pagos(prestamo_id);
CREATE INDEX idx_pagos_fecha         ON pagos(fecha);

-- Auto-update updated_at on clientes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
