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
}

export function Controls({ filter, onFilter, onAdd, onImport }: ControlsProps) {
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
      <button className="import-btn" onClick={onImport}>
        ⇪ 匯入
      </button>
      <button className="add-btn" onClick={onAdd}>
        ＋ 新增項目
      </button>
    </div>
  );
}
