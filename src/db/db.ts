import { db, run } from './sql';

export async function initDB() {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      server_id TEXT UNIQUE,
      nombre TEXT,
      email TEXT,
      moneda_preferida TEXT,
      fecha_registro TEXT,
      sincronizado INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS metas_ahorro (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      nombre_meta TEXT NOT NULL,
      monto_objetivo REAL NOT NULL,
      monto_actual REAL NOT NULL DEFAULT 0,
      fecha_meta TEXT NOT NULL,
      estado TEXT CHECK (estado IN ('en_progreso','cumplida','cancelada')) DEFAULT 'en_progreso',
      sincronizado INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);
        try {
        await run(`ALTER TABLE metas_ahorro ADD COLUMN server_id TEXT UNIQUE`);
        } catch (e) {
        }

}
