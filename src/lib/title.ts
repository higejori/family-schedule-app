import type { Period } from '../types';
import { yymmdd, mmdd } from './dateUtils';

// 例: 260808~0816_田中家 お盆予定
export function buildTitle(period: Period, familyLabel: string): string {
  const name = (period.name && period.name.trim()) || 'カスタム';
  return `${yymmdd(period.startDate)}~${mmdd(period.endDate)}_${familyLabel} ${name}予定`;
}

export function buildFilename(period: Period, familyLabel: string): string {
  const safe = buildTitle(period, familyLabel).replace(/[\\/:*?"<>|]/g, '_');
  return `${safe}.jpg`;
}
