-- lib/migrations/001_init.sql
BEGIN;

CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    district VARCHAR(255) NOT NULL,
    area NUMERIC NOT NULL CHECK (area > 0),
    price NUMERIC NOT NULL CHECK (price > 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMIT;