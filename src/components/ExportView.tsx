import type { CellData, Location, Member } from '../types';
import { Grid } from './Grid';
import { Legend } from './Legend';

interface ExportViewProps {
  title: string;
  dates: string[];
  members: Member[];
  locations: Location[];
  getCell: (memberId: string, date: string) => CellData | undefined;
}

// 画面外に常時マウントしておく画像化専用ビュー（sticky/overflowなし＝崩れ防止）。
// タイトルと凡例を焼き込むので、LINEに画像だけ送っても内容が伝わる。
export function ExportView({ title, dates, members, locations, getCell }: ExportViewProps) {
  return (
    <div id="export-root" className="export-view" aria-hidden="true">
      <h2 className="export-title">{title}</h2>
      <Legend locations={locations} />
      <Grid dates={dates} members={members} locations={locations} getCell={getCell} plain />
    </div>
  );
}
