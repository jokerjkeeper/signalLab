import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { ParsedProject } from '../types';
import { CAT_COLORS, CAT_LABELS } from '../constants';
import { parseImportText } from '../utils';
import { Modal } from './Modal';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  /** 既有項目名稱（用於去重，case-insensitive） */
  existingNames: string[];
  onImport: (items: ParsedProject[]) => void;
}

const PLACEHOLDER = `貼上 signal-scan / traction-scan 的 pipe 格式結果（表頭、--- 分隔線、換行的網址都會自動處理）：

名稱 | 來源平台 | 類別 | 官網 | 募資/指標 | 描述 | 為何值得追 | 來源連結
Manifest | Crunchbase | decision | 未知 | $60M Series A | AI 原生律所 | 服務即軟體 | https://...
foo/bar | GitHub Trending | infra | https://... | ⭐ 813/day | 本地優先 agent 工作區 | 非套殼、真實用途 | https://github.com/...
Arena AI | Product Hunt | tool | https://... | ▲ 320 | 從想法到出貨的 agent | 切入實際工作流 | https://...

（來源平台含 GitHub → 標為 OSS 牽引力、含 Product Hunt → 產品牽引力，會自動歸到「🔥 牽引力」）`;

function dot(color: string): ReactNode {
  return (
    <span
      style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }}
    />
  );
}

export function ImportModal({ open, onClose, existingNames, onImport }: ImportModalProps) {
  const [text, setText] = useState('');

  const { items, errors } = useMemo(() => parseImportText(text), [text]);

  // 去重：對既有項目 + 同批內重複
  const { toAdd, dupes } = useMemo(() => {
    const existing = new Set(existingNames.map((n) => n.toLowerCase()));
    const seen = new Set<string>();
    const add: ParsedProject[] = [];
    const dup: ParsedProject[] = [];
    for (const it of items) {
      const key = it.name.toLowerCase();
      if (existing.has(key) || seen.has(key)) {
        dup.push(it);
      } else {
        seen.add(key);
        add.push(it);
      }
    }
    return { toAdd: add, dupes: dup };
  }, [items, existingNames]);

  const handleClose = () => {
    setText('');
    onClose();
  };

  const handleConfirm = () => {
    if (!toAdd.length) return;
    onImport(toAdd);
    setText('');
    onClose();
  };

  const disabledStyle: CSSProperties | undefined = toAdd.length
    ? undefined
    : { opacity: 0.5, cursor: 'not-allowed' };

  return (
    <Modal open={open} onClose={handleClose}>
      <h2 style={{ marginBottom: 6 }}>貼上匯入</h2>
      <div className="modal-meta">
        貼上 pipe 格式結果，自動解析後加入追蹤清單（同名項目會自動略過）
      </div>

      <textarea
        className="import-textarea"
        placeholder={PLACEHOLDER}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {text.trim() && (
        <div className="import-preview">
          <div className="import-stat" style={{ marginBottom: 8 }}>
            將加入 <b style={{ color: 'var(--accent)' }}>{toAdd.length}</b> 筆
            {dupes.length ? ` · 已存在略過 ${dupes.length}` : ''}
            {errors.length ? ` · 無法解析 ${errors.length} 行` : ''}
          </div>

          {toAdd.map((it) => (
            <div className="import-preview-item" key={it.name}>
              {dot(CAT_COLORS[it.category])}
              <span style={{ fontWeight: 700 }}>{it.name}</span>
              <span style={{ color: 'var(--muted)' }}>{CAT_LABELS[it.category]}</span>
              {it.funding && <span style={{ color: 'var(--muted)' }}>· {it.funding}</span>}
              {it.url && <span style={{ color: 'var(--muted)' }}>🔗</span>}
            </div>
          ))}

          {dupes.map((it) => (
            <div className="import-preview-item" key={`dup-${it.name}`} style={{ opacity: 0.5 }}>
              {dot('var(--border2)')}
              <span style={{ textDecoration: 'line-through' }}>{it.name}</span>
              <span style={{ color: 'var(--muted)' }}>已存在</span>
            </div>
          ))}
        </div>
      )}

      <button
        className="submit-btn"
        onClick={handleConfirm}
        disabled={!toAdd.length}
        style={disabledStyle}
      >
        加入 {toAdd.length} 筆
      </button>
    </Modal>
  );
}
