import type { Settings as SettingsType, Member, Location } from '../types';
import { uid } from '../lib/holidays';

interface Props {
  settings: SettingsType;
  onChange: (s: SettingsType) => void;
  onClose: () => void;
}

// 家族名・場所・タイトル(家族ラベル)・定番予定を編集。
// メンバー/場所を削除しても既存セルのデータは残す（参照が消えたセルは無色でフォールバック描画）。
export function Settings({ settings, onChange, onClose }: Props) {
  const patch = (p: Partial<SettingsType>) => onChange({ ...settings, ...p });

  const setMember = (id: string, name: string) =>
    patch({ members: settings.members.map((m) => (m.id === id ? { ...m, name } : m)) });
  const addMember = () =>
    patch({ members: [...settings.members, { id: uid(), name: '新しい人' } as Member] });
  const delMember = (id: string) =>
    patch({ members: settings.members.filter((m) => m.id !== id) });

  const setLoc = (id: string, p: Partial<Location>) =>
    patch({ locations: settings.locations.map((l) => (l.id === id ? { ...l, ...p } : l)) });
  const addLoc = () =>
    patch({
      locations: [
        ...settings.locations,
        { id: uid(), name: '新しい場所', short: '新', color: '#cccccc' } as Location,
      ],
    });
  const delLoc = (id: string) =>
    patch({ locations: settings.locations.filter((l) => l.id !== id) });

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>設定</h2>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </div>

        <label className="field">
          家族ラベル（タイトルに使用）
          <input
            type="text"
            value={settings.familyLabel}
            onChange={(e) => patch({ familyLabel: e.target.value })}
          />
        </label>

        <div className="field">
          <div className="field-head">
            <span>家族メンバー</span>
            <button className="mini" onClick={addMember}>
              ＋追加
            </button>
          </div>
          {settings.members.map((m) => (
            <div key={m.id} className="row">
              <input type="text" value={m.name} onChange={(e) => setMember(m.id, e.target.value)} />
              <button
                className="mini danger"
                disabled={settings.members.length <= 1}
                onClick={() => delMember(m.id)}
              >
                削除
              </button>
            </div>
          ))}
        </div>

        <div className="field">
          <div className="field-head">
            <span>泊まる場所</span>
            <button className="mini" onClick={addLoc}>
              ＋追加
            </button>
          </div>
          {settings.locations.map((l) => (
            <div key={l.id} className="row">
              <input
                type="color"
                value={l.color}
                onChange={(e) => setLoc(l.id, { color: e.target.value })}
              />
              <input
                type="text"
                className="short-in"
                maxLength={2}
                value={l.short}
                onChange={(e) => setLoc(l.id, { short: e.target.value })}
              />
              <input
                type="text"
                value={l.name}
                onChange={(e) => setLoc(l.id, { name: e.target.value })}
              />
              <button
                className="mini danger"
                disabled={settings.locations.length <= 1}
                onClick={() => delLoc(l.id)}
              >
                削除
              </button>
            </div>
          ))}
        </div>

        <label className="field">
          定番予定（カンマ区切り）
          <input
            type="text"
            value={settings.activities.join(',')}
            onChange={(e) =>
              patch({
                activities: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>

        <button className="primary wide" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}
