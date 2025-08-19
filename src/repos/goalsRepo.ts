// src/repos/goalsRepo.ts
import dayjs from 'dayjs';
import { all, get, run } from '../db/sql';

type DBRow = {
  id: number;
  usuario_id: number;
  server_id?: string | null;
  nombre_meta: string;
  monto_objetivo: number;
  monto_actual: number;
  fecha_meta: string;
  estado?: 'en_progreso'|'cumplida'|'cancelada'|null;
  sincronizado: number; // 0/1
  updated_at: string;
};

export type GoalUI = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
};

function rowToUI(r: DBRow): GoalUI {
  return {
    id: String(r.id),
    name: r.nombre_meta,
    targetAmount: r.monto_objetivo,
    currentAmount: r.monto_actual,
    deadline: r.fecha_meta,
  };
}

export const GoalsRepo = {
  // --- CRUD UI ---
  async listByUser(usuario_id: number): Promise<GoalUI[]> {
    const rows = await all<DBRow>(
      `SELECT * FROM metas_ahorro WHERE usuario_id=? ORDER BY id DESC`,
      [usuario_id]
    );
    return rows.map(rowToUI);
  },

  async create(usuario_id: number, data: { name: string; targetAmount: number; deadline: string }) {
    const now = dayjs().toISOString();
    await run(
      `INSERT INTO metas_ahorro
       (usuario_id, nombre_meta, monto_objetivo, monto_actual, fecha_meta, estado, sincronizado, updated_at)
       VALUES (?,?,?,?,?, 'en_progreso', 0, ?)`,
      [usuario_id, data.name, data.targetAmount, 0, data.deadline, now]
    );
  },

  async updateFromUI(goal: Partial<GoalUI> & { id: string }) {
    const now = dayjs().toISOString();
    await run(
      `UPDATE metas_ahorro
       SET nombre_meta    = COALESCE(?, nombre_meta),
           monto_objetivo = COALESCE(?, monto_objetivo),
           monto_actual   = COALESCE(?, monto_actual),
           fecha_meta     = COALESCE(?, fecha_meta),
           sincronizado   = 0,
           updated_at     = ?
       WHERE id = ?`,
      [
        goal.name ?? null,
        goal.targetAmount ?? null,
        goal.currentAmount ?? null,
        goal.deadline ?? null,
        now,
        Number(goal.id),
      ]
    );
  },

  async remove(id: string) {
    await run(`DELETE FROM metas_ahorro WHERE id=?`, [Number(id)]);
  },

  async addContribution(id: string, amount: number) {
    const now = dayjs().toISOString();
    await run(
      `UPDATE metas_ahorro
       SET monto_actual = monto_actual + ?, sincronizado = 0, updated_at = ?
       WHERE id = ?`,
      [amount, now, Number(id)]
    );
  },

  // --- Helpers de SYNC ---
  async listUnsyncedByUser(usuario_id: number) {
    return all<DBRow>(
      `SELECT * FROM metas_ahorro WHERE usuario_id=? AND sincronizado=0`,
      [usuario_id]
    );
  },

  async markSyncedLocalIds(localIds: number[]) {
    const now = dayjs().toISOString();
    for (const id of localIds) {
      await run(`UPDATE metas_ahorro SET sincronizado=1, updated_at=? WHERE id=?`, [now, id]);
    }
  },

  // Upsert desde datos del servidor (Last-Write-Wins por updatedAt)
  async upsertFromServer(
    usuario_id: number,
    item: {
      serverId: string;
      name: string;
      targetAmount: number;
      currentAmount: number;
      deadline: string;     // 'YYYY-MM-DD'
      updatedAt: string;    // ISO
    }
  ) {
    const existing = await get<DBRow>(
      `SELECT * FROM metas_ahorro WHERE server_id=? LIMIT 1`,
      [item.serverId]
    );

    // Si existe y el server está más fresco → actualizamos
    if (existing) {
      const localNewer = dayjs(existing.updated_at).isAfter(dayjs(item.updatedAt));
      if (!localNewer) {
        await run(
          `UPDATE metas_ahorro
           SET nombre_meta=?, monto_objetivo=?, monto_actual=?, fecha_meta=?, estado='en_progreso',
               sincronizado=1, updated_at=?, usuario_id=?
           WHERE server_id=?`,
          [
            item.name, item.targetAmount, item.currentAmount, item.deadline,
            item.updatedAt, usuario_id, item.serverId
          ]
        );
      }
      return;
    }

    // Si no existe → insert
    await run(
      `INSERT INTO metas_ahorro
       (usuario_id, server_id, nombre_meta, monto_objetivo, monto_actual, fecha_meta, estado, sincronizado, updated_at)
       VALUES (?,?,?,?,?,?,'en_progreso',1,?)`,
      [usuario_id, item.serverId, item.name, item.targetAmount, item.currentAmount, item.deadline, item.updatedAt]
    );
  },
  async getServerId(localId: number): Promise<string | null> {
  const row = await get<{ server_id: string | null }>(
    `SELECT server_id FROM metas_ahorro WHERE id=? LIMIT 1`,
    [localId]
  );
  return row?.server_id ?? null;
}

};
