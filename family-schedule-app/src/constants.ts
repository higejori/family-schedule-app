import { FamilyMember, Location, Holiday } from './types';

export const FAMILY_MEMBERS: FamilyMember[] = [
  { id: '1', name: '雄一郎' },
  { id: '2', name: '紗理' },
  { id: '3', name: '小夏' },
  { id: '4', name: '蒼汰' },
];

export const LOCATIONS: Location[] = [
  { id: '1', name: '雄家', color: '#87CEEB' }, // 水色
  { id: '2', name: '紗家', color: '#FFB6C1' }, // ピンク
  { id: '3', name: '姫路', color: '#90EE90' }, // 緑
  { id: '4', name: '旅行', color: '#FFA500' }, // オレンジ
];

export const DEFAULT_HOLIDAYS: Holiday[] = [
  {
    id: '1',
    name: 'ゴールデンウィーク',
    startDate: '2025-04-26',
    endDate: '2025-05-06',
  },
  {
    id: '2',
    name: 'お盆休み',
    startDate: '2025-08-09',
    endDate: '2025-08-17',
  },
  {
    id: '3',
    name: '年末年始',
    startDate: '2025-12-28',
    endDate: '2026-01-05',
  },
  {
    id: '4',
    name: 'シルバーウィーク',
    startDate: '2025-09-13',
    endDate: '2025-09-23',
  },
];

export const DEFAULT_ACTIVITIES = [
  '外出',
  '在宅',
  '仕事',
  '学校',
  '休み',
  '旅行',
  '移動',
  '予定なし',
];