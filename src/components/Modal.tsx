import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * 共用 modal overlay：
 * - open 控制 .open class（顯示/隱藏）
 * - 點背景關閉、ESC 關閉、右上角 × 關閉
 */
export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={`modal-overlay${open ? ' open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="關閉">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
