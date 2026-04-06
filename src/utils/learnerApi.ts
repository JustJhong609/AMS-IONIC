import { Learner } from '../types';
import { supabase } from './supabaseClient';
import { readJsonValue, writeJsonValue } from './offlineStorage';

type SyncAction = 'create' | 'update' | 'delete';

interface PendingLearnerOperation {
  id: string;
  action: SyncAction;
  learner?: Learner;
  queuedAt: number;
  expectedUpdatedAt?: string | null;
  conflict?: {
    at: string;
    reason: string;
    serverUpdatedAt?: string;
  };
}

const LEARNER_CACHE_KEY = 'ams.learners.cache.v1';
const LEARNER_QUEUE_KEY = 'ams.learners.queue.v1';

type LearnerRow = {
  id: string;
  created_by: string;
  updated_at: string;
  region: string;
  division: string;
  district: string;
  calendar_year: number;
  mapped_by: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  name_extension: string | null;
  sex: 'Male' | 'Female';
  civil_status: string;
  birthdate: string;
  age: number;
  mother_tongue: string;
  is_ip: boolean;
  ip_tribe: string | null;
  religion: string | null;
  is_4ps_member: boolean;
  four_ps_or_ip: string | null;
  is_pwd: boolean;
  pwd_type: string | null;
  pwd_type_other: string | null;
  barangay: string;
  complete_address: string;
  role_in_family: string;
  father_name: string | null;
  mother_name: string | null;
  guardian_name: string | null;
  guardian_occupation: string | null;
  school_name: string | null;
  currently_studying: string;
  last_grade_completed: string;
  reason_for_not_attending: string;
  reason_for_not_attending_other: string | null;
  is_blp: boolean;
  occupation_type: string | null;
  employment_status: string | null;
  monthly_income: string | null;
  interested_in_als: string;
  contact_number: string | null;
  distance_km: number;
  travel_time: string;
  transport_mode: string;
  preferred_session_time: string;
  date_mapped: string;
};

const rowToLearner = (row: LearnerRow): Learner => ({
  id: row.id,
  createdBy: row.created_by,
  updatedAt: row.updated_at,
  region: row.region,
  division: row.division,
  district: row.district,
  calendarYear: row.calendar_year,
  mappedBy: row.mapped_by,
  lastName: row.last_name,
  firstName: row.first_name,
  middleName: row.middle_name,
  nameExtension: row.name_extension ?? undefined,
  sex: row.sex,
  civilStatus: row.civil_status,
  birthdate: row.birthdate,
  age: row.age,
  motherTongue: row.mother_tongue,
  isIP: row.is_ip,
  ipTribe: row.ip_tribe ?? undefined,
  religion: row.religion ?? undefined,
  is4PsMember: row.is_4ps_member,
  fourPsOrIp: row.four_ps_or_ip ?? undefined,
  isPwd: row.is_pwd,
  pwdType: row.pwd_type ?? undefined,
  pwdTypeOther: row.pwd_type_other ?? undefined,
  barangay: row.barangay,
  completeAddress: row.complete_address,
  roleInFamily: row.role_in_family,
  fatherName: row.father_name ?? undefined,
  motherName: row.mother_name ?? undefined,
  guardianName: row.guardian_name ?? undefined,
  guardianOccupation: row.guardian_occupation ?? undefined,
  schoolName: row.school_name ?? undefined,
  currentlyStudying: row.currently_studying,
  lastGradeCompleted: row.last_grade_completed,
  reasonForNotAttending: row.reason_for_not_attending,
  reasonForNotAttendingOther: row.reason_for_not_attending_other ?? undefined,
  isBlp: row.is_blp,
  occupationType: row.occupation_type ?? undefined,
  employmentStatus: row.employment_status ?? undefined,
  monthlyIncome: row.monthly_income ?? undefined,
  interestedInALS: row.interested_in_als,
  contactNumber: row.contact_number ?? undefined,
  distanceKm: Number(row.distance_km),
  travelTime: row.travel_time,
  transportMode: row.transport_mode,
  preferredSessionTime: row.preferred_session_time,
  dateMapped: row.date_mapped,
});

const learnerToRow = (learner: Learner) => ({
  id: learner.id,
  created_by: learner.createdBy,
  region: learner.region,
  division: learner.division,
  district: learner.district,
  calendar_year: learner.calendarYear,
  mapped_by: learner.mappedBy,
  last_name: learner.lastName,
  first_name: learner.firstName,
  middle_name: learner.middleName,
  name_extension: learner.nameExtension ?? null,
  sex: learner.sex,
  civil_status: learner.civilStatus,
  birthdate: learner.birthdate,
  age: learner.age,
  mother_tongue: learner.motherTongue,
  is_ip: learner.isIP,
  ip_tribe: learner.ipTribe ?? null,
  religion: learner.religion ?? null,
  is_4ps_member: learner.is4PsMember,
  four_ps_or_ip: learner.fourPsOrIp ?? null,
  is_pwd: learner.isPwd,
  pwd_type: learner.pwdType ?? null,
  pwd_type_other: learner.pwdTypeOther ?? null,
  barangay: learner.barangay,
  complete_address: learner.completeAddress,
  role_in_family: learner.roleInFamily,
  father_name: learner.fatherName ?? null,
  mother_name: learner.motherName ?? null,
  guardian_name: learner.guardianName ?? null,
  guardian_occupation: learner.guardianOccupation ?? null,
  school_name: learner.schoolName ?? null,
  currently_studying: learner.currentlyStudying,
  last_grade_completed: learner.lastGradeCompleted,
  reason_for_not_attending: learner.reasonForNotAttending,
  reason_for_not_attending_other: learner.reasonForNotAttendingOther ?? null,
  is_blp: learner.isBlp,
  occupation_type: learner.occupationType ?? null,
  employment_status: learner.employmentStatus ?? null,
  monthly_income: learner.monthlyIncome ?? null,
  interested_in_als: learner.interestedInALS,
  contact_number: learner.contactNumber ?? null,
  distance_km: learner.distanceKm,
  travel_time: learner.travelTime,
  transport_mode: learner.transportMode,
  preferred_session_time: learner.preferredSessionTime,
  date_mapped: learner.dateMapped,
});

const markConflict = (
  op: PendingLearnerOperation,
  reason: string,
  serverUpdatedAt?: string,
): PendingLearnerOperation => ({
  ...op,
  conflict: {
    at: new Date().toISOString(),
    reason,
    serverUpdatedAt,
  },
});

const getServerUpdatedAt = async (id: string): Promise<string | undefined> => {
  const { data, error } = await supabase
    .from('learners')
    .select('updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error) return undefined;
  return (data as { updated_at?: string } | null)?.updated_at;
};

const syncCreateOperation = async (operation: PendingLearnerOperation): Promise<void> => {
  if (!operation.learner) return;

  const { data, error } = await supabase
    .from('learners')
    .insert(learnerToRow(operation.learner))
    .select('updated_at')
    .single();
  if (error) throw error;

  if (data?.updated_at) {
    await upsertCachedLearner({ ...operation.learner, updatedAt: data.updated_at });
  }
};

const syncUpdateOperation = async (operation: PendingLearnerOperation): Promise<'synced' | 'conflict'> => {
  if (!operation.learner) return 'synced';

  const { id: _ignoredId, created_by: _ignoredCreatedBy, ...updatableRow } = learnerToRow(operation.learner);
  let query = supabase
    .from('learners')
    .update(updatableRow)
    .eq('id', operation.id);

  if (operation.expectedUpdatedAt) {
    query = query.eq('updated_at', operation.expectedUpdatedAt);
  }

  const { data, error } = await query.select('updated_at');
  if (error) throw error;

  const updatedRows = (data as Array<{ updated_at: string }> | null) ?? [];
  if (updatedRows.length === 0 && operation.expectedUpdatedAt) {
    return 'conflict';
  }

  const serverUpdatedAt = updatedRows[0]?.updated_at;
  if (serverUpdatedAt) {
    await upsertCachedLearner({ ...operation.learner, updatedAt: serverUpdatedAt });
  }

  return 'synced';
};

const syncDeleteOperation = async (operation: PendingLearnerOperation): Promise<'synced' | 'conflict'> => {
  let query = supabase
    .from('learners')
    .delete()
    .eq('id', operation.id);

  if (operation.expectedUpdatedAt) {
    query = query.eq('updated_at', operation.expectedUpdatedAt);
  }

  const { data, error } = await query.select('id');
  if (error) throw error;

  const deletedRows = (data as Array<{ id: string }> | null) ?? [];
  if (deletedRows.length === 0 && operation.expectedUpdatedAt) {
    const serverUpdatedAt = await getServerUpdatedAt(operation.id);
    return serverUpdatedAt ? 'conflict' : 'synced';
  }

  return 'synced';
};

const isOnline = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

const readCache = async (): Promise<Learner[]> => readJsonValue<Learner[]>(LEARNER_CACHE_KEY, []);

const writeCache = async (learners: Learner[]): Promise<void> => {
  await writeJsonValue(LEARNER_CACHE_KEY, learners);
};

const readQueue = async (): Promise<PendingLearnerOperation[]> =>
  readJsonValue<PendingLearnerOperation[]>(LEARNER_QUEUE_KEY, []);

const writeQueue = async (queue: PendingLearnerOperation[]): Promise<void> => {
  await writeJsonValue(LEARNER_QUEUE_KEY, queue);
};

const sortLearners = (learners: Learner[]): Learner[] =>
  [...learners].sort((a, b) => {
    if (a.dateMapped === b.dateMapped) {
      return a.lastName.localeCompare(b.lastName);
    }
    return a.dateMapped < b.dateMapped ? 1 : -1;
  });

const upsertCachedLearner = async (learner: Learner): Promise<void> => {
  const cache = await readCache();
  const idx = cache.findIndex(item => item.id === learner.id);
  if (idx >= 0) {
    cache[idx] = learner;
  } else {
    cache.push(learner);
  }
  await writeCache(sortLearners(cache));
};

const removeCachedLearner = async (id: string): Promise<void> => {
  const cache = (await readCache()).filter(item => item.id !== id);
  await writeCache(cache);
};

const applyPendingToLearners = (
  baseLearners: Learner[],
  queue: PendingLearnerOperation[],
): Learner[] => {
  const map = new Map(baseLearners.map(learner => [learner.id, learner]));

  for (const op of queue) {
    if (op.action === 'delete') {
      map.delete(op.id);
      continue;
    }

    if (op.learner) {
      map.set(op.id, op.learner);
    }
  }

  return sortLearners(Array.from(map.values()));
};

const queueOperation = async (nextOperation: PendingLearnerOperation): Promise<void> => {
  const queue = await readQueue();
  const existingIndex = queue.findIndex(op => op.id === nextOperation.id);

  if (existingIndex < 0) {
    queue.push(nextOperation);
    await writeQueue(queue);
    return;
  }

  const existing = queue[existingIndex];

  if (existing.action === 'create' && nextOperation.action === 'update' && nextOperation.learner) {
    queue[existingIndex] = { ...existing, learner: nextOperation.learner };
    await writeQueue(queue);
    return;
  }

  if (existing.action === 'create' && nextOperation.action === 'delete') {
    queue.splice(existingIndex, 1);
    await writeQueue(queue);
    return;
  }

  queue[existingIndex] = { ...nextOperation, queuedAt: existing.queuedAt };
  await writeQueue(queue);
};

const isLikelyNetworkError = (error: unknown): boolean => {
  const message = (error as { message?: string })?.message?.toLowerCase() ?? '';
  return (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout')
  );
};

const shouldQueueInstead = (error: unknown): boolean => !isOnline() || isLikelyNetworkError(error);

export const getPendingSyncCount = async (): Promise<number> => (await readQueue()).length;

export const syncPendingLearners = async (): Promise<{
  synced: number;
  failed: number;
  pending: number;
}> => {
  const pendingQueue = await readQueue();
  if (pendingQueue.length === 0 || !isOnline()) {
    return { synced: 0, failed: 0, pending: pendingQueue.length };
  }

  const remaining: PendingLearnerOperation[] = [];
  let synced = 0;
  let failed = 0;

  for (let i = 0; i < pendingQueue.length; i += 1) {
    const operation = pendingQueue[i];
    if (operation.conflict) {
      remaining.push(operation);
      continue;
    }

    try {
      if (operation.action === 'create' && operation.learner) {
        await syncCreateOperation(operation);
      }

      if (operation.action === 'update' && operation.learner) {
        const updateResult = await syncUpdateOperation(operation);
        if (updateResult === 'conflict') {
          failed += 1;
          const serverUpdatedAt = await getServerUpdatedAt(operation.id);
          remaining.push(
            markConflict(operation, 'Record was changed on another device. Review and re-save to sync.', serverUpdatedAt),
          );
          continue;
        }
      }

      if (operation.action === 'delete') {
        const deleteResult = await syncDeleteOperation(operation);
        if (deleteResult === 'conflict') {
          failed += 1;
          const serverUpdatedAt = await getServerUpdatedAt(operation.id);
          remaining.push(
            markConflict(operation, 'Delete skipped because record was updated on another device.', serverUpdatedAt),
          );
          continue;
        }
      }

      synced += 1;
    } catch (error) {
      failed += 1;
      if (shouldQueueInstead(error)) {
        remaining.push(operation, ...pendingQueue.slice(i + 1));
        break;
      }
      remaining.push(operation);
    }
  }

  await writeQueue(remaining);
  return {
    synced,
    failed,
    pending: remaining.length,
  };
};

export const fetchLearners = async (): Promise<Learner[]> => {
  const queue = await readQueue();
  let baseLearners: Learner[] = await readCache();

  if (isOnline()) {
    try {
      const { data, error } = await supabase
        .from('learners')
        .select('*')
        .order('date_mapped', { ascending: false })
        .order('last_name', { ascending: true });

      if (error) throw error;

      baseLearners = ((data ?? []) as LearnerRow[]).map(rowToLearner);
      await writeCache(baseLearners);
    } catch (error) {
      if (!shouldQueueInstead(error) && baseLearners.length === 0) {
        throw error;
      }
    }
  }

  return applyPendingToLearners(baseLearners, queue);
};

export const createLearner = async (learner: Learner): Promise<void> => {
  await upsertCachedLearner(learner);

  if (!isOnline()) {
    await queueOperation({ id: learner.id, action: 'create', learner, queuedAt: Date.now() });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('learners')
      .insert(learnerToRow(learner))
      .select('updated_at')
      .single();
    if (error) throw error;
    if (data?.updated_at) {
      await upsertCachedLearner({ ...learner, updatedAt: data.updated_at });
    }
  } catch (error) {
    if (!shouldQueueInstead(error)) {
      throw error;
    }
    await queueOperation({ id: learner.id, action: 'create', learner, queuedAt: Date.now() });
  }
};

export const updateLearner = async (learner: Learner): Promise<void> => {
  const existingInCache = (await readCache()).find(item => item.id === learner.id);
  const expectedUpdatedAt = learner.updatedAt ?? existingInCache?.updatedAt ?? null;

  await upsertCachedLearner(learner);

  if (!isOnline()) {
    await queueOperation({
      id: learner.id,
      action: 'update',
      learner,
      queuedAt: Date.now(),
      expectedUpdatedAt,
    });
    return;
  }

  try {
    const status = await syncUpdateOperation({
      id: learner.id,
      action: 'update',
      learner,
      queuedAt: Date.now(),
      expectedUpdatedAt,
    });

    if (status === 'conflict') {
      const serverUpdatedAt = await getServerUpdatedAt(learner.id);
      const cache = await readCache();
      const rolledBackCache = cache.filter(item => item.id !== learner.id);
      if (existingInCache) {
        rolledBackCache.push(existingInCache);
      }
      await writeCache(sortLearners(rolledBackCache));
      throw new Error(
        `This learner was updated on another device at ${serverUpdatedAt ?? 'a newer time'}. Please reload and apply your changes again.`,
      );
    }
  } catch (error) {
    if (!shouldQueueInstead(error)) {
      throw error;
    }
    await queueOperation({
      id: learner.id,
      action: 'update',
      learner,
      queuedAt: Date.now(),
      expectedUpdatedAt,
    });
  }
};

export const deleteLearner = async (id: string): Promise<void> => {
  const existingInCache = (await readCache()).find(item => item.id === id);
  const expectedUpdatedAt = existingInCache?.updatedAt ?? null;

  await removeCachedLearner(id);

  if (!isOnline()) {
    await queueOperation({ id, action: 'delete', queuedAt: Date.now(), expectedUpdatedAt });
    return;
  }

  try {
    const status = await syncDeleteOperation({
      id,
      action: 'delete',
      queuedAt: Date.now(),
      expectedUpdatedAt,
    });

    if (status === 'conflict') {
      if (existingInCache) {
        await upsertCachedLearner(existingInCache);
      }
      throw new Error('Delete blocked because this learner was updated on another device. Refresh and try again.');
    }
  } catch (error) {
    if (!shouldQueueInstead(error)) {
      throw error;
    }
    await queueOperation({ id, action: 'delete', queuedAt: Date.now(), expectedUpdatedAt });
  }
};
