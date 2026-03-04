import type { Scene } from '@/types/environment';

export interface PlayRecord {
    id: string;
    songName: string;
    focusDuration: number;
    scene: Scene;
    createdAt: string;
    photoUrl?: string;
}

export interface GetRecordsParams {
    page: number;
    pageSize: number;
}

export interface GetRecordsResult {
    list: PlayRecord[];
    total: number;
    hasMore: boolean;
}
