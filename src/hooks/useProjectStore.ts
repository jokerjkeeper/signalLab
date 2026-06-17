import { useEffect, useRef, useState } from 'react';
import type { Project } from '../types';
import { sanitizeImportedProjects } from '../utils';
import seedData from '../../data/projects.json';

/**
 * 取代 useLocalStorage 的持久層。
 *
 * 載入來源一律是打包進來的 data/projects.json（git 追蹤的正式資料）。
 * 寫入行為依環境分流：
 *   - 開發（npm run dev）：debounce 後 POST /api/projects，由 dev 伺服器寫回檔案 →
 *     你 git commit / push 後，其他電腦 pull 就看得到。
 *   - 部署（靜態站）：沒有後端可寫檔，改存 localStorage 草稿（只在這個瀏覽器，不會回 repo）。
 *
 * 另含一次性遷移：把舊版 localStorage（signal-lab.projects）的資料併進檔案基底，避免升級時遺失。
 */

const isDev = import.meta.env.DEV;

const LEGACY_KEY = 'signal-lab.projects'; // 舊版資料來源（只在 dev 做一次性遷移）
const MIGRATED_FLAG = 'signal-lab.migrated-to-file';
const DRAFT_KEY = 'signal-lab.local-draft'; // 部署（靜態）版的本機暫存草稿

export type PersistMode = 'file' | 'local';

export interface StoreStatus {
  /** file = dev 寫檔；local = 部署版只存 localStorage */
  mode: PersistMode;
  /** 是否正在寫入 */
  saving: boolean;
  /** 最近一次寫入錯誤訊息 */
  error: string | null;
}

const baseline: Project[] = sanitizeImportedProjects(seedData);

type SetValue = (value: Project[] | ((prev: Project[]) => Project[])) => void;

/** 把 extra 內既有清單沒有的項目（依名稱去重）併到最前面，並補齊 id / date。 */
function mergeByName(primary: Project[], extra: Project[]): Project[] {
  const names = new Set(primary.map((p) => p.name.toLowerCase()));
  const ids = new Set(primary.map((p) => p.id));
  let counter = Date.now();
  const additions: Project[] = [];
  for (const p of extra) {
    const key = p.name.toLowerCase();
    if (names.has(key)) continue;
    names.add(key);
    let id = p.id;
    if (id === 0 || ids.has(id)) id = counter++;
    ids.add(id);
    additions.push({ ...p, id, date: p.date || new Date().toISOString().slice(0, 7) });
  }
  return additions.length ? [...additions, ...primary] : primary;
}

function readStored(key: string): Project[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = sanitizeImportedProjects(JSON.parse(raw));
    return parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

function loadInitial(): Project[] {
  if (isDev) {
    // 一次性遷移：把舊 localStorage 併進檔案基底（之後不再讀，避免覆蓋刪除）
    try {
      if (!localStorage.getItem(MIGRATED_FLAG)) {
        const legacy = readStored(LEGACY_KEY);
        if (legacy) return mergeByName(baseline, legacy);
      }
    } catch {
      /* localStorage 不可用時直接用檔案基底 */
    }
    return baseline;
  }

  // 部署版：優先用本機草稿，否則用打包進來的檔案
  return readStored(DRAFT_KEY) ?? baseline;
}

export function useProjectStore(): [Project[], SetValue, StoreStatus] {
  const [projects, setProjects] = useState<Project[]>(loadInitial);
  const [status, setStatus] = useState<StoreStatus>({
    mode: isDev ? 'file' : 'local',
    saving: false,
    error: null,
  });

  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current != null) window.clearTimeout(timer.current);
    setStatus((s) => ({ ...s, saving: true }));

    timer.current = window.setTimeout(() => {
      if (isDev) {
        fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projects),
        })
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            // 遷移結果已成功寫檔，標記避免下次重複遷移
            try {
              localStorage.setItem(MIGRATED_FLAG, '1');
            } catch {
              /* ignore */
            }
            setStatus((s) => ({ ...s, saving: false, error: null }));
          })
          .catch((err: unknown) => {
            setStatus((s) => ({ ...s, saving: false, error: String(err) }));
          });
      } else {
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(projects));
          setStatus((s) => ({ ...s, saving: false, error: null }));
        } catch (err) {
          setStatus((s) => ({ ...s, saving: false, error: String(err) }));
        }
      }
    }, 400);

    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, [projects]);

  return [projects, setProjects, status];
}
