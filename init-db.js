import { sql } from '@vercel/postgres';
await sql`CREATE TABLE IF NOT EXISTS stats (id SERIAL PRIMARY KEY, type TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`;
console.log("Database initialized");
