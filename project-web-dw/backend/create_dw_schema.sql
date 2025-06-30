-- Dimensiones  ----------------------------------------------------
CREATE TABLE IF NOT EXISTS dim_producto (
  producto_key   SERIAL PRIMARY KEY,
  producto       TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_almacen (
  almacen_key    SERIAL PRIMARY KEY,
  almacen        TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_cliente (
  cliente_key    SERIAL PRIMARY KEY,
  cliente        TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_modo_transporte (
  modo_key       SERIAL PRIMARY KEY,
  modo_transporte TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_destino (
  destino_key    SERIAL PRIMARY KEY,
  destino        TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_tiempo (
  tiempo_key  SERIAL PRIMARY KEY,
  fecha       DATE UNIQUE,
  anio        INT,
  mes         INT,
  dia         INT,
  trimestre   INT
);

-- Hechos  ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS fact_inventario (
  id_inventario   TEXT PRIMARY KEY,
  producto_key    INT REFERENCES dim_producto(producto_key),
  almacen_key     INT REFERENCES dim_almacen(almacen_key),
  tiempo_key      INT REFERENCES dim_tiempo(tiempo_key),
  stock_actual    INT,
  estado_producto TEXT
);

CREATE TABLE IF NOT EXISTS fact_transporte (
  id_envio            TEXT PRIMARY KEY,
  origen              TEXT,
  destino_key         INT REFERENCES dim_destino(destino_key),
  modo_key            INT REFERENCES dim_modo_transporte(modo_key),
  tiempo_salida_key   INT REFERENCES dim_tiempo(tiempo_key),
  tiempo_llegada_key  INT REFERENCES dim_tiempo(tiempo_key),
  temperatura_promedio FLOAT,
  gps                 TEXT,
  costo_flete         INT
);

CREATE TABLE IF NOT EXISTS fact_orden (
  id_orden         TEXT PRIMARY KEY,
  cliente_key      INT REFERENCES dim_cliente(cliente_key),
  producto_key     INT REFERENCES dim_producto(producto_key),
  tiempo_key       INT REFERENCES dim_tiempo(tiempo_key),
  cantidad         FLOAT,
  precio_unitario  INT,
  estado_pago      TEXT,
  destino_key      INT REFERENCES dim_destino(destino_key)
);
