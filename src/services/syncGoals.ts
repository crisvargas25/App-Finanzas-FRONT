// src/services/syncGoals.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { GoalsRepo } from '../repos/goalsRepo';
import { apiService } from '../shared/services/api'; 

export async function syncDownGoals(usuarioLocalId: number) {
  try {
    const userServerId = await AsyncStorage.getItem('user_id');
    if (!userServerId) return;

    const docs = await apiService.listGoalsFromCloud(userServerId); // Array del back
    for (const d of docs) {
      await GoalsRepo.upsertFromServer(usuarioLocalId, {
        serverId: d._id,
        name: d.nombreMeta,
        targetAmount: d.montoObjetivo,
        currentAmount: d.montoActual,
        deadline: (d.fechaMeta || '').slice(0, 10), // YYYY-MM-DD
        updatedAt: d.updatedAt || dayjs().toISOString(),
      });
    }
  } catch (e) {
    console.log('syncDownGoals skipped:', e);
  }
}

// 🔼 Sube cambios locales usando create/update (no hay /sync en el back)
export async function syncUpGoals(usuarioLocalId: number) {
  try {
    const userServerId = await AsyncStorage.getItem('user_id');
    if (!userServerId) return;

    const unsynced = await GoalsRepo.listUnsyncedByUser(usuarioLocalId);
    if (!unsynced.length) return;

    for (const u of unsynced) {
      if (u.server_id) {
        // existe en servidor ⇒ UPDATE
        await apiService.updateGoalInCloud(u.server_id, {
          name: u.nombre_meta,
          targetAmount: u.monto_objetivo,
          currentAmount: u.monto_actual,
          deadline: u.fecha_meta,
        });
      } else {
        // ❗ AQUI VA EL BLOQUE QUE PREGUNTAS
        // no existe en servidor ⇒ CREATE y guardamos server_id
        const newId = await apiService.createGoalInCloud({
          userId: userServerId,
          name: u.nombre_meta,
          targetAmount: u.monto_objetivo,
          currentAmount: u.monto_actual,
          deadline: u.fecha_meta,
          status: 'en_progreso',
        });
        await GoalsRepo.setServerId(u.id, newId); 
      }
    }

    await GoalsRepo.markSyncedLocalIds(unsynced.map((x: any) => x.id));
  } catch (e) {
    console.log('syncUpGoals skipped:', e);
  }
}
