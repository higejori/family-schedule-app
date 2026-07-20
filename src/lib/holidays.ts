import type { Period } from '../types';
import { todayISO } from './dateUtils';

export function uid(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type PresetTemplate = Omit<Period, 'id'>;

// 当年・翌年（＋1月上旬に残る前年開始の年末年始）の定番休暇を自動生成。
// 過去に終わったものは除外し、開始日順で返す。日付は選択後に編集可能。
export function defaultHolidayPresets(now: Date = new Date()): PresetTemplate[] {
  const Y = now.getFullYear();
  const list: PresetTemplate[] = [];
  const mk = (name: string, startDate: string, endDate: string): PresetTemplate => ({
    kind: 'preset',
    name,
    startDate,
    endDate,
  });
  for (const y of [Y - 1, Y, Y + 1]) {
    list.push(mk('ゴールデンウィーク', `${y}-04-29`, `${y}-05-06`));
    list.push(mk('お盆', `${y}-08-10`, `${y}-08-17`));
    // 年末年始は開始日の年で扱う（12/28〜翌1/5）
    list.push(mk('年末年始', `${y}-12-28`, `${y + 1}-01-05`));
  }
  const t = todayISO();
  return list
    .filter((p) => p.endDate >= t) // 終わった休暇は出さない
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}
