import { useCallback, useEffect, useState } from 'react';

// 同期保存版 localStorage フック（数KB規模なのでdebounce不要・毎回setItem）。
// 別タブでの変更にも storage イベントで追従する。
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const read = useCallback((): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch (e) {
      console.error(`localStorage read failed for "${key}"`, e);
      return initial;
    }
  }, [key]);

  const [value, setValue] = useState<T>(read);

  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setValue((prev) => {
        const next = v instanceof Function ? (v as (p: T) => T)(prev) : v;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (e) {
          console.error(`localStorage write failed for "${key}"`, e);
        }
        return next;
      });
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, read]);

  return [value, set];
}
