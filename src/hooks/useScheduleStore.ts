import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LS_KEYS } from '../constants';
import { cellKey } from '../types';
import type { CellData, Period, ScheduleMap } from '../types';

type SchedulesAll = Record<string, ScheduleMap>;

// 期間（uuidキー）と、期間ごとのスケジュールをまとめて管理するストア。
export function useScheduleStore() {
  const [periods, setPeriods] = useLocalStorage<Period[]>(LS_KEYS.periods, []);
  const [all, setAll] = useLocalStorage<SchedulesAll>(LS_KEYS.schedules, {});
  const [activeId, setActiveId] = useLocalStorage<string | null>(LS_KEYS.active, null);

  const activePeriod = useMemo(
    () => periods.find((p) => p.id === activeId) ?? null,
    [periods, activeId],
  );
  const schedule: ScheduleMap = useMemo(
    () => (activeId ? all[activeId] ?? {} : {}),
    [all, activeId],
  );

  const addPeriod = useCallback(
    (p: Period) => {
      setPeriods((prev) => [...prev, p]);
      setActiveId(p.id);
    },
    [setPeriods, setActiveId],
  );

  const updatePeriod = useCallback(
    (id: string, patch: Partial<Period>) => {
      setPeriods((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    },
    [setPeriods],
  );

  const deletePeriod = useCallback(
    (id: string) => {
      setPeriods((prev) => prev.filter((p) => p.id !== id));
      setAll((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setActiveId((cur) => (cur === id ? null : cur));
    },
    [setPeriods, setAll, setActiveId],
  );

  const selectPeriod = useCallback((id: string | null) => setActiveId(id), [setActiveId]);

  const getCell = useCallback(
    (memberId: string, date: string): CellData | undefined => schedule[cellKey(memberId, date)],
    [schedule],
  );

  // セルを部分更新。locationId/text を undefined にすると該当項目を消す。
  // 両方空になったらセルごと削除。
  const setCell = useCallback(
    (memberId: string, date: string, patch: Partial<CellData>) => {
      if (!activeId) return;
      const k = cellKey(memberId, date);
      setAll((prev) => {
        const cur = prev[activeId] ?? {};
        const merged: CellData = { ...cur[k], ...patch };
        if (merged.locationId === undefined && (!merged.text || merged.text.trim() === '')) {
          const nextMap = { ...cur };
          delete nextMap[k];
          return { ...prev, [activeId]: nextMap };
        }
        const cleaned: CellData = {};
        if (merged.locationId !== undefined) cleaned.locationId = merged.locationId;
        if (merged.text && merged.text.trim() !== '') cleaned.text = merged.text.trim();
        return { ...prev, [activeId]: { ...cur, [k]: cleaned } };
      });
    },
    [activeId, setAll],
  );

  return {
    periods,
    activeId,
    activePeriod,
    schedule,
    addPeriod,
    updatePeriod,
    deletePeriod,
    selectPeriod,
    getCell,
    setCell,
  };
}
