import type { Project } from '../types';
import { SIGNAL_TYPE_META } from '../constants';
import { Modal } from './Modal';
import { LinkIcon } from './LinkIcon';

interface DetailModalProps {
  project: Project | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export function DetailModal({ project, onClose, onDelete }: DetailModalProps) {
  const open = project != null;

  return (
    <Modal open={open} onClose={onClose}>
      {project && (
        <>
          <h2>{project.name}</h2>
          <div className="modal-meta">
            {`${project.source} · ${project.category} · ${
              project.funding || SIGNAL_TYPE_META[project.signalType ?? 'funding'].blank
            } · ${project.date || ''}`}
          </div>

          {project.url && (
            <div style={{ marginBottom: 14 }}>
              <a
                className="modal-url-btn"
                href={project.url}
                target="_blank"
                rel="noopener"
              >
                <LinkIcon size={12} /> 前往官網 — {project.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          <div className="modal-section">
            <div className="modal-section-title">項目描述</div>
            <div className="modal-body">{project.desc || '—'}</div>
          </div>
          <div className="modal-section">
            <div className="modal-section-title">你的備註</div>
            <div className="modal-body">{project.notes || '—'}</div>
          </div>

          {/* AI 分析：本次停用。直接從瀏覽器呼叫 Anthropic API 會因 CORS／金鑰外洩無法運作，
              待後續加上後端代理後再啟用。保留按鈕位置與說明。 */}
          <button className="analyze-btn" disabled>
            ⚡ AI 分析（需後端，暫未啟用）
          </button>
          <div className="ai-output">
            <span className="thinking">
              // AI 深度分析需透過後端代理呼叫 Anthropic API（避免 CORS 與金鑰外洩），目前版本尚未啟用。
            </span>
          </div>

          <button
            className="delete-btn"
            onClick={() => {
              if (window.confirm(`確定刪除「${project.name}」？此操作無法復原。`)) {
                onDelete(project.id);
              }
            }}
          >
            🗑 刪除此項目
          </button>
        </>
      )}
    </Modal>
  );
}
