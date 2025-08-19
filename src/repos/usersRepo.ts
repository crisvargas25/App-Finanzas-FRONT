import dayjs from 'dayjs';
import { get, run } from '../db/sql';

export const UsersRepo = {
  async ensureLocalByServerId(
    serverId: string,
    profile?: { nombre?: string; email?: string }
  ): Promise<number> {
    const found = await get<{ id: number }>(
      'SELECT id FROM usuarios WHERE server_id=? LIMIT 1',
      [serverId]
    );
    if (found?.id) return found.id;

    const now = dayjs().toISOString();
    await run(
      `INSERT INTO usuarios (server_id,nombre,email,fecha_registro,sincronizado,updated_at)
       VALUES (?,?,?,?,1,?)`,
      [serverId, profile?.nombre ?? null, profile?.email ?? null, now, now]
    );
    const created = await get<{ id: number }>(
      'SELECT id FROM usuarios WHERE server_id=? LIMIT 1',
      [serverId]
    );
    return created!.id;
  },
};
