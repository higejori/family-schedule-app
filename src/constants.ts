import type { Settings } from './types';

// 設定の初期値（旧アプリのハードコード値を継承。以後はアプリ内設定で編集可能）
export const DEFAULT_SETTINGS: Settings = {
  familyLabel: '田中家',
  members: [
    { id: 'm1', name: '雄一郎' },
    { id: 'm2', name: '紗理' },
    { id: 'm3', name: '小夏' },
    { id: 'm4', name: '蒼汰' },
  ],
  locations: [
    { id: 'l1', name: '雄家', short: '雄', color: '#87CEEB' },
    { id: 'l2', name: '紗家', short: '紗', color: '#FFB6C1' },
    { id: 'l3', name: '姫路', short: '姫', color: '#90EE90' },
    { id: 'l4', name: '旅行', short: '旅', color: '#FFC078' },
  ],
  activities: ['外出', '在宅', '仕事', '学校', '休み', '旅行', '移動'],
};

// localStorage キー（v2 スキーマ）
export const LS_KEYS = {
  settings: 'fsa:v2:settings',
  periods: 'fsa:v2:periods',
  schedules: 'fsa:v2:schedules',
  active: 'fsa:v2:active',
} as const;
