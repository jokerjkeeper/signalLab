import type { FilterKey } from '../types';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'edu', label: '② 教育' },
  { key: 'decision', label: '⑤ 決策整合' },
  { key: 'infra', label: '基礎設施' },
  { key: 'high', label: '高信號 ★' },
];

interface ControlsProps {
  filter: FilterKey;
  onFilter: (f: FilterKey) => void;
  onAdd: () => void;
  onImport: () => void;
  onExport: () => void;
  onRestore: () => void;
}

export function Controls({ filter, onFilter, onAdd, onImport, onExport, onRestore }: ControlsProps) {
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
