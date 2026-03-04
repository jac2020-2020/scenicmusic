import axios from 'axios';
import type { GetRecordsParams, GetRecordsResult, PlayRecord } from '@/types/record';

const RECORD_STORAGE_KEY = 'scenicmusic_records';

/** 将 blob URL 转为 data URL 以便持久化存储 */
export async function resolvePhotoUrlForStorage(url: string | undefined): Promise<string | undefined> {
    if (!url) return undefined;
    if (url.startsWith('data:')) return url;
    if (!url.startsWith('blob:')) return url;
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        return await new Promise<string | undefined>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read blob'));
            reader.readAsDataURL(blob);
        });
    } catch {
        return undefined;
    }
}

interface SaveRecordPayload {
    songName: string;
    focusDuration: number;
    scene: PlayRecord['scene'];
    createdAt?: string;
    photoUrl?: string;
}

const sortByTimeDesc = (a: PlayRecord, b: PlayRecord) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

const readLocalRecords = (): PlayRecord[] => {
    const raw = window.localStorage.getItem(RECORD_STORAGE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as PlayRecord[];
        if (!Array.isArray(parsed)) return [];
        return parsed.sort(sortByTimeDesc);
    } catch {
        return [];
    }
};

const writeLocalRecords = (records: PlayRecord[]) => {
    window.localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(records.sort(sortByTimeDesc)));
};

export const saveRecord = async (payload: SaveRecordPayload): Promise<PlayRecord> => {
    const record: PlayRecord = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        songName: payload.songName,
        focusDuration: Math.max(0, Math.floor(payload.focusDuration)),
        scene: payload.scene,
        createdAt: payload.createdAt ?? new Date().toISOString(),
        photoUrl: payload.photoUrl,
    };

    try {
        const response = await axios.post<PlayRecord>('/api/records', record);
        return response.data;
    } catch {
        const localRecords = readLocalRecords();
        localRecords.unshift(record);
        writeLocalRecords(localRecords);
        return record;
    }
};

const isValidRecordsResult = (data: unknown): data is GetRecordsResult => {
    if (!data || typeof data !== 'object') return false;
    const o = data as Record<string, unknown>;
    return (
        Array.isArray(o.list) &&
        typeof o.total === 'number' &&
        typeof o.hasMore === 'boolean'
    );
};

export const getRecords = async ({ page, pageSize }: GetRecordsParams): Promise<GetRecordsResult> => {
    const safePage = Math.max(1, Math.floor(page));
    const safePageSize = Math.max(1, Math.floor(pageSize));

    try {
        const response = await axios.get<GetRecordsResult>('/api/records', {
            params: { page: safePage, pageSize: safePageSize },
        });
        if (isValidRecordsResult(response.data)) return response.data;
    } catch {
        /* API 失败，使用 localStorage */
    }
    const all = readLocalRecords();
    const start = (safePage - 1) * safePageSize;
    const end = start + safePageSize;
    const list = all.slice(start, end);
    return {
        list,
        total: all.length,
        hasMore: end < all.length,
    };
};
