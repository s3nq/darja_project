CREATE TABLE IF NOT EXISTS properties (
	id SERIAL PRIMARY KEY,
	address TEXT NOT NULL,
	district TEXT NOT NULL,
	area REAL NOT NULL,
	price INTEGER NOT NULL,
	condition TEXT,
	status TEXT NOT NULL
);
