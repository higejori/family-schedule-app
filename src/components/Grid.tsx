import type { CellData, Location, Member } from '../types';
import { cellKey } from '../types';
import { formatWithDay, isSaturday, isSunday } from '../lib/dateUtils';
import { Cell } from './Cell';

interface GridProps {
  dates: string[];
  members: Member[];
  locations: Location[];
  getCell: (memberId: string, date: string) => CellData | undefined;
  // 対話用（省略時はプレーン表示＝エクスポート用）
  interactive?: boolean;
  plain?: boolean;
  mode?: 'paint' | 'write';
  selected?: { memberId: string; date: string } | null;
  editing?: boolean;
  editingText?: string;
  onCellPointer?: (memberId: string, date: string) => void;
  onEditingText?: (v: string) => void;
  onCommit?: () => void;
  onCancel?: () => void;
}

export function Grid(props: GridProps) {
  const {
    dates,
    members,
    locations,
    getCell,
    interactive = false,
    plain = false,
    mode = 'paint',
    selected = null,
    editing = false,
    editingText = '',
    onCellPointer,
    onEditingText,
    onCommit,
    onCancel,
  } = props;

  const locById = (id?: string) => (id ? locations.find((l) => l.id === id) : undefined);

  return (
    <table className={`grid${plain ? ' plain' : ''}`}>
      <thead>
        <tr>
          <th className="corner" />
          {members.map((m) => (
            <th key={m.id} className="member-h">
              {m.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dates.map((date) => {
          const dh = `date-h${isSaturday(date) ? ' sat' : isSunday(date) ? ' sun' : ''}`;
          return (
            <tr key={date}>
              <th className={dh} scope="row">
                {formatWithDay(date)}
              </th>
              {members.map((m) => {
                const cell = getCell(m.id, date);
                const location = locById(cell?.locationId);
                if (!interactive) {
                  return (
                    <td
                      key={cellKey(m.id, date)}
                      className="cell"
                      style={{ backgroundColor: location?.color ?? '#f7f7f7' }}
                    >
                      <div className="cell-content">
                        {location && <span className="cell-short">{location.short}</span>}
                        {cell?.text && <span className="cell-text">{cell.text}</span>}
                      </div>
                    </td>
                  );
                }
                const isSel = !!selected && selected.memberId === m.id && selected.date === date;
                return (
                  <Cell
                    key={cellKey(m.id, date)}
                    cell={cell}
                    location={location}
                    mode={mode}
                    selected={isSel}
                    editing={editing}
                    editingText={editingText}
                    onPointer={() => onCellPointer?.(m.id, date)}
                    onEditingText={(v) => onEditingText?.(v)}
                    onCommit={() => onCommit?.()}
                    onCancel={() => onCancel?.()}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
