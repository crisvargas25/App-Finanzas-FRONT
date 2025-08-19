import { openDatabaseSync } from 'expo-sqlite';

export const db = openDatabaseSync('finanzas.db');

export async function run(sql: string, params: any[] = []): Promise<void> {
  await db.runAsync(sql, params);
}

export async function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return db.getAllAsync<T>(sql, params);
}

export async function get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const row = await db.getFirstAsync<T>(sql, params);
  return row ?? null;
}
