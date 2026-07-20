import { useEffect, useRef } from 'react';
import type { CellData, Location } from '../types';

interface CellProps {
  memberId: string;
  date: string;
  cell?: CellData;
  location?: Location;
  mode: 'paint' | 'write';
  selected: boolean;
  editing: boolean;
  editingText: string;
  onPointer: () => void;
  onEditingText: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}

export function Cell({
  memberId,
  date,
  cell,
  location,
  mode,
  selected,
  editing,
  editingText,
  onPointer,
  onEditingText,
  onCommit,
  onCancel,
}: CellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isWriting = mode === 'write' && selected && editing;

  useEffect(() => {
    if (isWriting && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      // モバイルでキーボードにセルが隠れないよう中央へ寄せる
      inputRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [isWriting]);

  return (
    <td
      className={`cell${selected ? ' selected' : ''}`}
      style={{ backgroundColor: location?.color ?? '#f7f7f7' }}
      onClick={onPointer}
      data-member={memberId}
      data-date={date}
    >
      {isWriting ? (
        <input
          ref={inputRef}
          className="cell-input"
          type="text"
          value={editingText}
          onChange={(e) => onEditingText(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onBlur={onCommit}
          onKeyDown={(e) => {
            // 日本語変換中のEnterは確定に使わせる
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') {
              e.preventDefault();
              onCommit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              onCancel();
            }
          }}
        />
      ) : (
        <div className="cell-content">
          {location && <span className="cell-short">{location.short}</span>}
          {cell?.text && <span className="cell-text">{cell.text}</span>}
        </div>
      )}
    </td>
  );
}
