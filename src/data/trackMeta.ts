import type { Weather, Time, Scene } from '@/types/environment';

export interface TrackMeta {
  poem?: string[];
  sunoPrompt?: string;
}

export const TRACK_META: Record<
  Weather,
  Partial<Record<Time, Partial<Record<Scene, Record<string, TrackMeta>>>>>
> = {
  '晴天': {
    '清晨': {
      '阅读': {
        '清晨的第一缕光.mp3': {
          poem: ['金色照窗', '页影微动', '鸟鸣入字', '心绪如新'],
          sunoPrompt: 'Warm morning ambient, soft piano, gentle pad, 82 BPM, spacious reverb',
        },
        '晓风与诗.mp3': {
          poem: ['晓风拂页', '语轻如露', '字落檐前', '意远天青'],
          sunoPrompt: 'Neo-classical minimal, light strings and acoustic guitar, airy texture, 88 BPM',
        },
        '朝露.mp3': {
          poem: ['朝露未干', '光在指间', '书声细细', '一日初安'],
          sunoPrompt: 'Calm ambient, felt piano and soft tape texture, 80 BPM, low density',
        },
      },
      '诗会': {
        '水波中的十四行.mp3': {
          poem: ['水光摇句', '字影成涟', '韵脚轻落', '风过不言'],
          sunoPrompt: 'Ethereal cinematic, gentle strings and airy flute, 86 BPM, roomy reverb',
        },
        '光中的诗会.mp3': {
          poem: ['光在字旁', '声在檐下', '诗意缓升', '与风相答'],
          sunoPrompt: 'Cinematic neo-folk, plucked strings, soft percussion, 92 BPM, warm tone',
        },
        '词句间.mp3': {
          poem: ['词句之间', '呼吸有形', '杯底余韵', '心绪安宁'],
          sunoPrompt: 'Minimal ambient, piano motifs with soft pad, 84 BPM, subtle tape hiss',
        },
      },
    },
  },
  '多云': {},
  '雨天': {},
};
