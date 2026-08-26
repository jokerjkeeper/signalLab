import type { Category, FilterKey } from '../types';
import { CAT_LABELS } from '../constants';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'edu', label: '② 教育' },
  { key: 'decision', label: '⑤ 決策整合' },
  { key: 'infra', label: '基礎設施' },
  { key: 'traction', label: '🔥 牽引力' },
  { key: 'high', label: '高信號 ★' },
];

const CATEGORY_OPTIONS: Category[] = ['edu', 'decision', 'infra', 'data', 'health', 'tool', 'other'];

interface ControlsProps {
  filter: FilterKey;
  onFilter: (f: FilterKey) => void;
  /** 資料中出現過的來源（動態） */
  sources: string[];
  sourceFilter: string; // 'all' 或某來源字串
  onSourceFilter: (s: string) => void;
  categoryFilter: Category | 'all';
  onCategoryFilter: (c: Category | 'all') => void;
  onAdd: () => void;
  onImport: () => void;
  onExport: () => void;
  onRestore: () => void;
}

export function Controls({
  filter,
  onFilter,
  sources,
  sourceFilter,
  onSourceFilter,
  categoryFilter,
  onCategoryFilter,
  onAdd,
  onImport,
  onExport,
  onRestore,
}: ControlsProps) {
  return (
    <div className="controls">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`filter-btn${filter === f.key ? ' active' : ''}`}
          onClick={() => onFilter(f.key)}
        >
          {f.label}
        </button>
      ))}

      <select
        className={`filter-select${sourceFilter !== 'all' ? ' active' : ''}`}
        value={sourceFilter}
        onChange={(e) => onSourceFilter(e.target.value)}
        title="依來源篩選"
      >
        <option value="all">全部來源</option>
        {sources.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className={`filter-select${categoryFilter !== 'all' ? ' active' : ''}`}
        value={categoryFilter}
        onChange={(e) => onCategoryFilter(e.target.value as Category | 'all')}
        title="依類別篩選"
      >
        <option value="all">全部類別</option>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {CAT_LABELS[c]}
          </option>
        ))}
      </select>

      <div className="spacer" />
      <button className="import-btn" onClick={onExport} title="下載 JSON 備份">
        ⤓ 匯出
      </button>
      <button className="import-btn" onClick={onRestore} title="從 JSON 備份還原（合併）">
        ⤒ 還原
      </button>
      <button className="import-btn" onClick={onImport} title="貼上 pipe 格式文字匯入">
        ⇪ 匯入
      </button>
      <button className="add-btn" onClick={onAdd}>
        ＋ 新增項目
      </button>
    </div>
  );
}
