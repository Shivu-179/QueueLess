import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_miH2lKqILX9T@ep-shy-frost-ayio04x6-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const globalForPg = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;

export async function query(text: string, params?: any[]) {
  return await pool.query(text, params);
}