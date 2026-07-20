// 日付ユーティリティ。すべてローカル日付演算で統一する
// （旧 getDatesInRange の toISOString はUTC変換で1日ズレる潜在バグ→排除）

const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

// 'YYYY-MM-DD' → ローカル Date（時刻はローカル0時）
export function parseLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function toISOLocal(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function todayISO(): string {
  return toISOLocal(new Date());
}

export function datesInRange(startDate: string, endDate: string): string[] {
  const res: string[] = [];
  if (!startDate || !endDate) return res;
  const cur = parseLocal(startDate);
  const last = parseLocal(endDate);
  let guard = 0;
  while (cur.getTime() <= last.getTime() && guard < 2000) {
    res.push(toISOLocal(cur));
    cur.setDate(cur.getDate() + 1);
    guard++;
  }
  return res;
}

export function dayOfWeek(dateStr: string): number {
  return parseLocal(dateStr).getDay();
}
export const isSaturday = (s: string) => dayOfWeek(s) === 6;
export const isSunday = (s: string) => dayOfWeek(s) === 0;

// 'M/D'
export function formatMD(dateStr: string): string {
  const d = parseLocal(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// 'M/D(曜)'
export function formatWithDay(dateStr: string): string {
  return `${formatMD(dateStr)}(${WEEK[dayOfWeek(dateStr)]})`;
}

// 'YYMMDD'
export function yymmdd(dateStr: string): string {
  const d = parseLocal(dateStr);
  return `${pad2(d.getFullYear() % 100)}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}

// 'MMDD'
export function mmdd(dateStr: string): string {
  const d = parseLocal(dateStr);
  return `${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}

// 期間の日数
export function rangeLength(startDate: string, endDate: string): number {
  return datesInRange(startDate, endDate).length;
}
