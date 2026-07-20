import type { Period } from '../types';
import { formatMD } from '../lib/dateUtils';

interface Props {
  periods: Period[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PeriodList({ periods, onSelect, onDelete }: Props) {
  if (periods.length === 0) return null;
  const sorted = [...periods].sort((a, b) => b.startDate.localeCompare(a.startDate));
  return (
    <section className="card">
      <h2>保存した予定</h2>
      <ul className="period-list">
        {sorted.map((p) => (
          <li key={p.id}>
            <button className="period-open" onClick={() => onSelect(p.id)}>
              <span className="period-name">{p.name}</span>
              <span className="period-range">
                {formatMD(p.startDate)} 〜 {formatMD(p.endDate)}
              </span>
            </button>
            <button
              className="period-del"
              title="削除"
              onClick={() => {
                if (confirm(`「${p.name}」を削除しますか？（元に戻せません）`)) onDelete(p.id);
              }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
