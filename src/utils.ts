import type { Category, FilterKey, ParsedProject, Project, SignalType } from './types';

/** 依篩選條件過濾項目（對應原 filterProjects） */
export function filterProjects(list: Project[], filter: FilterKey): Project[] {
  if (filter === 'all') return list;
  if (filter === 'high') return list.filter((p) => p.signal >= 4);
  if (filter === 'edu')
    return list.filter((p) => p.category === 'edu' || p.relevance.includes('2'));
  if (filter === 'decision')
    return list.filter((p) => p.category === 'decision' || p.relevance.includes('5'));
  if (filter === 'infra')
    return list.filter((p) => p.category === 'infra' || p.category === 'data');
  if (filter === 'traction')
    return list.filter((p) => p.signalType === 'oss' || p.signalType === 'product');
  return list;
}

export interface Stats {
  total: number;
  highSignal: number;
  avgScore: number | string; // 無分數時為 '—'
}

/** Header 三項統計（對應原 render 中的統計段） */
export function deriveStats(list: Project[]): Stats {
  const total = list.length;
  const highSignal = list.filter((p) => p.signal >= 4).length;
  const scores = list
    .filter((p): p is Project & { aiScore: number } => p.aiScore != null)
    .map((p) => p.aiScore);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : '—';
  return { total, highSignal, avgScore };
}

/** 本週信號文字（對應原 updateInsight） */
export function buildInsight(list: Project[]): string {
  const eduCount = list.filter((p) => p.relevance.includes('2')).length;
  const decCount = list.filter((p) => p.relevance.includes('5')).length;
  const highScore = list.filter((p) => p.aiScore != null && p.aiScore >= 80);
  let text = `追蹤中 ${list.length} 個項目 · ② 教育相關 ${eduCount} 個 · ⑤ 決策整合相關 ${decCount} 個`;
  if (highScore.length) text += ` · 高分: ${highScore.map((p) => p.name).join(', ')}`;
  return text;
}

// ── 訊號軸推導 ───────────────────────────────────────────
const VALID_SIGNAL_TYPES: SignalType[] = ['funding', 'oss', 'product'];

/** 由來源平台字串推導訊號軸（GitHub Trending → oss、Product Hunt → product、其餘 → funding） */
export function deriveSignalType(source: string): SignalType {
  const s = source.toLowerCase();
  if (/github/.test(s)) return 'oss';
  if (/product\s*hunt/.test(s)) return 'product';
  return 'funding';
}

// ── JSON 備份還原 ────────────────────────────────────────
const VALID_CATEGORIES: Category[] = ['edu', 'decision', 'infra', 'data', 'health', 'tool', 'other'];

/**
 * 把任意 JSON 資料防呆轉成合法的 Project[]。
 * 用於還原備份檔：欄位型別錯誤時以預設值填補，缺少 name 的項目直接丟棄，
 * 確保壞檔不會污染既有資料。
 */
export function sanitizeImportedProjects(data: unknown): Project[] {
  if (!Array.isArray(data)) return [];
  const out: Project[] = [];
  for (const raw of data) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    const name = typeof o.name === 'string' ? o.name.trim() : '';
    if (!name) continue;

    const signalNum = Number(o.signal);
    const aiNum = Number(o.aiScore);
    const source = typeof o.source === 'string' && o.source ? o.source : '其他';
    const signalType = VALID_SIGNAL_TYPES.includes(o.signalType as SignalType)
      ? (o.signalType as SignalType)
      : deriveSignalType(source);

    out.push({
      id: typeof o.id === 'number' ? o.id : 0, // 0 = 待 App 重新指派
      name,
      source,
      category: VALID_CATEGORIES.includes(o.category as Category) ? (o.category as Category) : 'other',
      url: typeof o.url === 'string' && o.url ? o.url : null,
      desc: typeof o.desc === 'string' ? o.desc : '',
      notes: typeof o.notes === 'string' ? o.notes : '',
      funding: typeof o.funding === 'string' ? o.funding : '',
      signal: Number.isFinite(signalNum) ? Math.min(5, Math.max(1, Math.round(signalNum))) : 3,
      aiScore: o.aiScore == null ? null : Number.isFinite(aiNum) ? aiNum : null,
      relevance: Array.isArray(o.relevance)
        ? o.relevance.filter((r): r is string => typeof r === 'string')
        : [],
      date: typeof o.date === 'string' ? o.date : '',
      signalType,
    });
  }
  return out;
}

// ── 貼上匯入（pipe 格式）─────────────────────────────────
/** 類別字串 → Category（接受英文 key 與中文標籤） */
const CATEGORY_ALIASES: Record<string, Category> = {
  edu: 'edu',
  教育: 'edu',
  培訓: 'edu',
  decision: 'decision',
  決策: 'decision',
  決策整合: 'decision',
  法律: 'decision',
  infra: 'infra',
  基礎設施: 'infra',
  data: 'data',
  數據: 'data',
  合成數據: 'data',
  health: 'health',
  醫療: 'health',
  生技: 'health',
  tool: 'tool',
  工具: 'tool',
  生產力: 'tool',
  other: 'other',
  其他: 'other',
};

function normalizeCategory(raw: string): Category {
  const key = raw.trim().toLowerCase();
  if (key in CATEGORY_ALIASES) return CATEGORY_ALIASES[key];
  // 容錯：包含關鍵字（如「決策整合 / 法律」）
  for (const alias of Object.keys(CATEGORY_ALIASES)) {
    if (key.includes(alias)) return CATEGORY_ALIASES[alias];
  }
  return 'other';
}

const isUrl = (s: string): boolean => /^https?:\/\//i.test(s.trim());
/** 視為「空 / 未填」的值（未知、待確認、—、N/A…） */
const isBlank = (s: string): boolean =>
  !s.trim() || /^(未知|待確認|n\/?a|[—–-])/i.test(s.trim());

/**
 * 解析貼上的 pipe 格式文字 → 可匯入的項目陣列。
 * 容錯處理：
 * - 自動忽略表頭列、`---` 分隔線、無關標題行
 * - 把「換行的網址」（不含 `|` 的續行）接回上一列的最後一欄
 * - 官網欄為未知時，用來源連結當作可點連結，並把來源連結保留進備註
 */
export function parseImportText(text: string): { items: ParsedProject[]; errors: string[] } {
  // 1. 清理 + 合併續行（不含 | 的行視為上一列的延續，例如換行的網址）
  const merged: string[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^[—–-]{2,}$/.test(line)) continue; // --- 分隔線
    if (!line.includes('|')) {
      if (merged.length > 0) merged[merged.length - 1] = `${merged[merged.length - 1]} ${line}`;
      continue; // 沒有上一列就是標題行 → 丟棄
    }
    merged.push(line);
  }

  const items: ParsedProject[] = [];
  const errors: string[] = [];

  for (const row of merged) {
    const cells = row.split('|').map((c) => c.trim());
    const name = cells[0] ?? '';

    // 跳過表頭
    if (name === '名稱' || (name.includes('名稱') && row.includes('類別'))) continue;
    if (!name) {
      errors.push(row);
      continue;
    }

    const [, source = '', categoryRaw = '', urlRaw = '', funding = '', desc = '', notesRaw = '', sourceLink = ''] = cells;

    const category = normalizeCategory(categoryRaw);
    const homepage = isUrl(urlRaw) ? urlRaw.trim() : '';
    const link = isUrl(sourceLink) ? sourceLink.trim() : '';
    const url = homepage || link || null;

    let notes = isBlank(notesRaw) ? '' : notesRaw;
    if (link && link !== url) notes = notes ? `${notes}\n來源: ${link}` : `來源: ${link}`;

    const relevance: string[] = [];
    if (category === 'edu') relevance.push('2');
    if (category === 'decision' || category === 'health') relevance.push('5');

    const resolvedSource = source || '其他';
    items.push({
      name,
      source: resolvedSource,
      category,
      url,
      desc: isBlank(desc) ? '' : desc,
      notes,
      funding: isBlank(funding) ? '' : funding,
      signal: 3,
      aiScore: null,
      relevance,
      signalType: deriveSignalType(resolvedSource),
    });
  }

  return { items, errors };
}
