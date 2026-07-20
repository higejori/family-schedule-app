import { useEffect, useMemo, useState } from 'react';
import { useSettings } from './hooks/useSettings';
import { useScheduleStore } from './hooks/useScheduleStore';
import { datesInRange, rangeLength } from './lib/dateUtils';
import { buildTitle, buildFilename } from './lib/title';
import { exportOrShare } from './lib/exportImage';
import { HolidaySelector } from './components/HolidaySelector';
import { PeriodList } from './components/PeriodList';
import { Grid } from './components/Grid';
import { Legend } from './components/Legend';
import { ModeBar, type PaintTarget } from './components/ModeBar';
import { ExportView } from './components/ExportView';
import { Settings } from './components/Settings';
import type { Period } from './types';

export default function App() {
  const [settings, setSettings] = useSettings();
  const store = useScheduleStore();
  const { activePeriod } = store;

  const [mode, setMode] = useState<'paint' | 'write'>('paint');
  const [paintTarget, setPaintTarget] = useState<PaintTarget>(settings.locations[0]?.id ?? 'eraser');
  const [selected, setSelected] = useState<{ memberId: string; date: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showPeriodEdit, setShowPeriodEdit] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const dates = useMemo(
    () => (activePeriod ? datesInRange(activePeriod.startDate, activePeriod.endDate) : []),
    [activePeriod],
  );
  const title = activePeriod ? buildTitle(activePeriod, settings.familyLabel) : '';

  // 期間を切り替えたら選択・編集をリセット（表示外の日付への誤書き込みを防ぐ）
  useEffect(() => {
    setSelected(null);
    setEditing(false);
    setEditingText('');
    setMode('paint');
    setShowPeriodEdit(false);
  }, [store.activeId]);

  // 塗り対象が現在の場所一覧に無くなったら先頭へ寄せる
  useEffect(() => {
    if (paintTarget !== 'eraser' && !settings.locations.some((l) => l.id === paintTarget)) {
      setPaintTarget(settings.locations[0]?.id ?? 'eraser');
    }
  }, [settings.locations, paintTarget]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const handleCellPointer = (memberId: string, date: string) => {
    if (mode === 'paint') {
      if (paintTarget === 'eraser') {
        store.setCell(memberId, date, { locationId: undefined });
        return;
      }
      const cur = store.getCell(memberId, date);
      // 同じ場所を再タップ＝トグルOFF
      store.setCell(memberId, date, {
        locationId: cur?.locationId === paintTarget ? undefined : paintTarget,
      });
    } else {
      setSelected({ memberId, date });
      setEditingText(store.getCell(memberId, date)?.text ?? '');
      setEditing(true);
    }
  };

  // 長押し/ドラッグの連続塗り（トグルなし。消しゴムは連続消し）
  const paintCellDrag = (memberId: string, date: string) => {
    store.setCell(memberId, date, {
      locationId: paintTarget === 'eraser' ? undefined : paintTarget,
    });
  };

  const commitEdit = () => {
    if (selected) store.setCell(selected.memberId, selected.date, { text: editingText });
    setEditing(false);
  };
  const cancelEdit = () => setEditing(false);

  const applyActivity = (text: string) => {
    if (!selected) return;
    store.setCell(selected.memberId, selected.date, { text });
    setEditingText(text);
    setEditing(false);
  };

  const doExport = async () => {
    const node = document.getElementById('export-root');
    if (!node) return;
    setExporting(true);
    try {
      const filename = buildFilename(activePeriod!, settings.familyLabel);
      const res = await exportOrShare(node, filename, title);
      showToast(res === 'shared' ? '共有しました' : '画像を保存しました');
    } catch (e) {
      console.error('export failed', e);
      showToast('画像の生成に失敗しました');
    } finally {
      setExporting(false);
    }
  };

  const editPeriod = (patch: Partial<Period>) => {
    if (!activePeriod) return;
    const next = { ...activePeriod, ...patch };
    if (next.endDate < next.startDate) return; // 逆転は無視
    store.updatePeriod(activePeriod.id, patch);
  };

  // ---- スタート画面 ----
  if (!activePeriod) {
    return (
      <div className="app">
        <header className="topbar">
          <h1>家族スケジュール</h1>
          <button className="icon" onClick={() => setShowSettings(true)} title="設定">
            ⚙
          </button>
        </header>
        <main className="start">
          <HolidaySelector onCreate={store.addPeriod} />
          <PeriodList periods={store.periods} onSelect={store.selectPeriod} onDelete={store.deletePeriod} />
        </main>
        {showSettings && (
          <Settings settings={settings} onChange={setSettings} onClose={() => setShowSettings(false)} />
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  // ---- スケジュール画面 ----
  const longWarn = rangeLength(activePeriod.startDate, activePeriod.endDate) > 31;

  return (
    <div className="app schedule">
      <header className="topbar">
        <button className="icon" onClick={() => store.selectPeriod(null)} title="一覧へ戻る">
          ←
        </button>
        <h1 className="ttl">{title}</h1>
        <div className="topbar-actions">
          <button className="icon" onClick={() => setShowPeriodEdit((v) => !v)} title="期間を編集">
            📅
          </button>
          <button className="icon" onClick={() => setShowSettings(true)} title="設定">
            ⚙
          </button>
        </div>
      </header>

      {showPeriodEdit && (
        <div className="period-edit card">
          <label>
            タイトル
            <input
              type="text"
              value={activePeriod.name}
              onChange={(e) => editPeriod({ name: e.target.value })}
            />
          </label>
          <label>
            開始日
            <input
              type="date"
              value={activePeriod.startDate}
              onChange={(e) => editPeriod({ startDate: e.target.value })}
            />
          </label>
          <label>
            終了日
            <input
              type="date"
              value={activePeriod.endDate}
              onChange={(e) => editPeriod({ endDate: e.target.value })}
            />
          </label>
        </div>
      )}

      <Legend locations={settings.locations} />
      {longWarn && <p className="warn">期間が長いです（31日超）。画像が大きくなり共有しづらくなることがあります。</p>}

      <div className="table-wrap">
        <Grid
          interactive
          dates={dates}
          members={settings.members}
          locations={settings.locations}
          getCell={store.getCell}
          mode={mode}
          selected={selected}
          editing={editing}
          editingText={editingText}
          onCellPointer={handleCellPointer}
          onPaintDragCell={paintCellDrag}
          onEditingText={setEditingText}
          onCommit={commitEdit}
          onCancel={cancelEdit}
        />
      </div>

      <div className="share-row">
        <button className="primary" onClick={doExport} disabled={exporting}>
          {exporting ? '生成中…' : '📤 画像で共有 / 保存'}
        </button>
      </div>

      <ModeBar
        mode={mode}
        onMode={(m) => {
          setMode(m);
          if (m === 'paint') setEditing(false);
        }}
        locations={settings.locations}
        paintTarget={paintTarget}
        onPaintTarget={setPaintTarget}
        activities={settings.activities}
        onActivity={applyActivity}
        canWriteChip={mode === 'write' && !!selected}
      />

      {/* 画面外の画像化専用ビュー */}
      <ExportView
        title={title}
        dates={dates}
        members={settings.members}
        locations={settings.locations}
        getCell={store.getCell}
      />

      {showSettings && (
        <Settings settings={settings} onChange={setSettings} onClose={() => setShowSettings(false)} />
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
