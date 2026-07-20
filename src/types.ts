// ドメイン型定義

export interface Member {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;   // 例: 雄家
  short: string;  // セル内併記用の1文字 例: 雄
  color: string;  // hex（html2canvasのoklch非対応のため必ずhex）
}

export type PeriodKind = 'preset' | 'custom';

export interface Period {
  id: string;         // uuid（日付ではなくuuidでキー化する＝日付を直しても入力が迷子にならない）
  kind: PeriodKind;
  name: string;       // プリセット名 or カスタムタイトル
  startDate: string;  // 'YYYY-MM-DD'
  endDate: string;    // 'YYYY-MM-DD'
}

// セル1つ分。locationId は optional＝「色なし＋文字あり」を許容する。
export interface CellData {
  locationId?: string;
  text?: string;
}

// スケジュール本体。キーは `${memberId}:${date}`
export type ScheduleMap = Record<string, CellData>;

export interface Settings {
  familyLabel: string;   // 例: 田中家
  members: Member[];
  locations: Location[];
  activities: string[];  // 書くモードの定番予定チップ
}

export function cellKey(memberId: string, date: string): string {
  return `${memberId}:${date}`;
}
