import type { Location } from '../types';

export type PaintTarget = string | 'eraser';

interface ModeBarProps {
  mode: 'paint' | 'write';
  onMode: (m: 'paint' | 'write') => void;
  locations: Location[];
  paintTarget: PaintTarget;
  onPaintTarget: (t: PaintTarget) => void;
  activities: string[];
  onActivity: (text: string) => void;
  canWriteChip: boolean;
}

export function ModeBar({
  mode,
  onMode,
  locations,
  paintTarget,
  onPaintTarget,
  activities,
  onActivity,
  canWriteChip,
}: ModeBarProps) {
  return (
    <div className={`modebar mode-${mode}`}>
      <div className="mode-toggle">
        <button
          className={mode === 'paint' ? 'active' : ''}
          onClick={() => onMode('paint')}
          type="button"
        >
          🎨 塗る
        </button>
        <button
          className={mode === 'write' ? 'active' : ''}
          onClick={() => onMode('write')}
          type="button"
        >
          ✏️ 書く
        </button>
      </div>

      <div className="mode-context">
        {mode === 'paint' ? (
          <div className="chips">
            {locations.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`chip loc-chip${paintTarget === l.id ? ' active' : ''}`}
                onClick={() => onPaintTarget(l.id)}
              >
                <span className="chip-swatch" style={{ backgroundColor: l.color }}>
                  {l.short}
                </span>
                {l.name}
              </button>
            ))}
            <button
              type="button"
              className={`chip eraser${paintTarget === 'eraser' ? ' active' : ''}`}
              onClick={() => onPaintTarget('eraser')}
            >
              🧽 消しゴム
            </button>
          </div>
        ) : canWriteChip ? (
          <div className="chips">
            {activities.map((a) => (
              <button key={a} type="button" className="chip" onClick={() => onActivity(a)}>
                {a}
              </button>
            ))}
          </div>
        ) : (
          <p className="mode-hint">セルをタップして予定を入力（定番はチップで一発）</p>
        )}
      </div>
    </div>
  );
}
