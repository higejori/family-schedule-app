import { useMemo, useState } from 'react';
import type { Period } from '../types';
import { defaultHolidayPresets, uid } from '../lib/holidays';
import { formatMD } from '../lib/dateUtils';

interface Props {
  onCreate: (p: Period) => void;
}

export function HolidaySelector({ onCreate }: Props) {
  const [tab, setTab] = useState<'preset' | 'custom'>('preset');
  const presets = useMemo(() => defaultHolidayPresets(), []);

  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const invalidRange = !!start && !!end && end < start;
  const canApply = !!start && !!end && !invalidRange;

  return (
    <section className="card">
      <h2>長期休暇を選ぶ</h2>
      <div className="tabs">
        <button className={tab === 'preset' ? 'active' : ''} onClick={() => setTab('preset')}>
          定番の休暇
        </button>
        <button className={tab === 'custom' ? 'active' : ''} onClick={() => setTab('custom')}>
          カスタム期間
        </button>
      </div>

      {tab === 'preset' ? (
        <div className="preset-list">
          {presets.map((p) => (
            <button
              key={`${p.name}-${p.startDate}`}
              className="preset"
              onClick={() => onCreate({ id: uid(), ...p })}
            >
              <span className="preset-name">
                {p.startDate.slice(0, 4)}年 {p.name}
              </span>
              <span className="preset-range">
                {formatMD(p.startDate)} 〜 {formatMD(p.endDate)}
              </span>
            </button>
          ))}
          {presets.length === 0 && <p className="muted">直近の定番休暇がありません。カスタム期間で作成してください。</p>}
        </div>
      ) : (
        <div className="custom-form">
          <label>
            タイトル
            <input
              type="text"
              value={title}
              placeholder="例：家族旅行、秋の連休"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            開始日
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label>
            終了日
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>
          {invalidRange && <p className="error">終了日は開始日以降にしてください。</p>}
          <button
            className="primary"
            disabled={!canApply}
            onClick={() =>
              onCreate({
                id: uid(),
                kind: 'custom',
                name: title.trim() || 'カスタム',
                startDate: start,
                endDate: end,
              })
            }
          >
            この期間で作成
          </button>
        </div>
      )}
    </section>
  );
}
