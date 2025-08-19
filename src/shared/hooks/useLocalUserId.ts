import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsersRepo } from '../../repos/usersRepo';

export function useLocalUserId() {
  const [localId, setLocalId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const serverId = (await AsyncStorage.getItem('user_id')) || 'local:demo@local';
      const name     = (await AsyncStorage.getItem('user_name')) || 'Local';
      const email    = (await AsyncStorage.getItem('user_email')) || 'demo@local';

      const id = await UsersRepo.ensureLocalByServerId(serverId, { nombre: name, email });
      setLocalId(id);
    })();
  }, []);

  return localId;
}
