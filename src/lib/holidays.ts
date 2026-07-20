import type { Period } from '../types';
import { parseLocal, toISOLocal, todayISO } from './dateUtils';

// 指定日から直前の土曜（当日が土曜ならそのまま）
function prevSaturday(iso: string): string {
  const d = parseLocal(iso);
  while (d.getDay() !== 6) d.setDate(d.getDate() - 1);
  return toISOLocal(d);
}

// 指定日から直後の日曜（当日が日曜ならそのまま）
function nextSunday(iso: string): string {
  const d = parseLocal(iso);
  while (d.getDay() !== 0) d.setDate(d.getDate() + 1);
  return toISOLocal(d);
}

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
    // GW: 4/29(昭和の日)直前の土曜 〜 5/6
    list.push(mk('ゴールデンウィーク', prevSaturday(`${y}-04-29`), `${y}-05-06`));
    // お盆: 8/11(山の日)直前の土曜 〜 8/15直後の日曜（2026年は8/8〜8/16）
    list.push(mk('お盆', prevSaturday(`${y}-08-11`), nextSunday(`${y}-08-15`)));
    // 年末年始は開始日の年で扱う（12/28〜翌1/5）
    list.push(mk('年末年始', `${y}-12-28`, `${y + 1}-01-05`));
  }
  const t = todayISO();
  return list
    .filter((p) => p.endDate >= t) // 終わった休暇は出さない
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}
