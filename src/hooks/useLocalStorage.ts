import { useEffect, useState } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * 把 state 同步到 localStorage 的泛型 hook。
 * 介面與 useState 一致（支援 updater function）。
 * 讀寫皆包 try/catch，避免隱私模式 / 容量上限時整個 app 崩潰。
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[useLocalStorage] 讀取 "${key}" 失敗，改用預設值。`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[useLocalStorage] 寫入 "${key}" 失敗。`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
