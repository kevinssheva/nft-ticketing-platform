import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';
import { env } from '@/configs/env';

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
export type Database = typeof db;