import { useEffect, useRef } from 'react';
import type { CellData, Location, Member } from '../types';
import { cellKey } from '../types';
import { formatWithDay, isSaturday, isSunday } from '../lib/dateUtils';
import { Cell } from './Cell';

const LONG_PRESS_MS = 350; // タッチの長押し判定
const TOUCH_CANCEL_PX = 10; // これ以上動いたらスクロール意図とみなし長押し解除
const MOUSE_DRAG_PX = 4; // マウスはこの距離動いたら即ドラッグ塗り開始

interface DragState {
  down: boolean;
  active: boolean;
  timer: number | null;
  startX: number;
  startY: number;
  member: string;
  date: string;
  pointerType: string;
  painted: Set<string>;
}

const initialDrag = (): DragState => ({
  down: false,
  active: false,
  timer: null,
  startX: 0,
  startY: 0,
  member: '',
  date: '',
  pointerType: '',
  painted: new Set(),
});

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
  // 長押し/ドラッグでの連続塗り（トグルなしで塗る・消しゴムは連続消し）
  onPaintDragCell?: (memberId: string, date: string) => void;
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
    onPaintDragCell,
    onEditingText,
    onCommit,
    onCancel,
  } = props;

  const locById = (id?: string) => (id ? locations.find((l) => l.id === id) : undefined);

  // ---- 連続塗り（長押し→なぞる / マウスドラッグ）----
  const tableRef = useRef<HTMLTableElement>(null);
  const drag = useRef<DragState>(initialDrag());
  const suppressClick = useRef(false);
  const paintable = interactive && mode === 'paint' && !!onPaintDragCell;

  const paintAt = (member: string, date: string) => {
    const k = `${member}:${date}`;
    if (drag.current.painted.has(k)) return;
    drag.current.painted.add(k);
    onPaintDragCell?.(member, date);
  };

  const activateDrag = () => {
    drag.current.active = true;
    drag.current.timer = null;
    (navigator as Navigator & { vibrate?: (ms: number) => boolean }).vibrate?.(25);
    paintAt(drag.current.member, drag.current.date);
  };

  const resetDrag = () => {
    if (drag.current.timer !== null) window.clearTimeout(drag.current.timer);
    drag.current = initialDrag();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!paintable) return;
    const td = (e.target as Element).closest?.('td[data-date]');
    if (!td) return;
    resetDrag();
    const st = drag.current;
    st.down = true;
    st.startX = e.clientX;
    st.startY = e.clientY;
    st.member = td.getAttribute('data-member')!;
    st.date = td.getAttribute('data-date')!;
    st.pointerType = e.pointerType;
    if (e.pointerType !== 'mouse') {
      st.timer = window.setTimeout(activateDrag, LONG_PRESS_MS);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const st = drag.current;
    if (!paintable || !st.down) return;
    const dist = Math.hypot(e.clientX - st.startX, e.clientY - st.startY);
    if (!st.active) {
      if (st.pointerType === 'mouse') {
        if (e.buttons === 1 && dist > MOUSE_DRAG_PX) activateDrag();
      } else if (st.timer !== null && dist > TOUCH_CANCEL_PX) {
        // 動きが大きい＝スクロール意図。長押しを解除
        window.clearTimeout(st.timer);
        st.timer = null;
      }
      if (!st.active) return;
    }
    // タッチは暗黙ポインタキャプチャでtargetが動かないため座標からセルを特定
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const td = el?.closest?.('td[data-date]');
    if (td) paintAt(td.getAttribute('data-member')!, td.getAttribute('data-date')!);
  };

  const handlePointerEnd = () => {
    if (!drag.current.down) return;
    if (drag.current.active) suppressClick.current = true; // 直後のclickで単発トグルさせない
    resetDrag();
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // ドラッグ塗り中だけスクロールを止める（passive:falseが必要なのでnativeで登録）
  useEffect(() => {
    const t = tableRef.current;
    if (!t) return;
    const onTouchMove = (ev: TouchEvent) => {
      if (drag.current.active) ev.preventDefault();
    };
    t.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => t.removeEventListener('touchmove', onTouchMove);
  }, []);

  return (
    <table
      ref={tableRef}
      className={`grid${plain ? ' plain' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClickCapture={handleClickCapture}
    >
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
                    memberId={m.id}
                    date={date}
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
