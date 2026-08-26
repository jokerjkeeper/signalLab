import { useState } from 'react';
import type { Category, Project, ProjectFormValues } from '../types';
import { deriveSignalType } from '../utils';
import { Modal } from './Modal';

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (project: Project) => void;
}

const EMPTY_FORM: ProjectFormValues = {
  name: '',
  source: 'YC',
  category: 'edu',
  url: '',
  desc: '',
  notes: '',
  funding: '',
  signal: 3,
};

const SOURCES = ['YC', 'GitHub Trending', 'Product Hunt', 'Kickstarter', 'Indiegogo', 'Crunchbase', 'Twitter/X', '其他'];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'edu', label: '教育 / 培訓' },
  { value: 'decision', label: '決策整合 / 法律 / 醫療' },
  { value: 'infra', label: 'AI 基礎設施' },
  { value: 'data', label: '數據 / 合成數據' },
  { value: 'health', label: '醫療 / 生技' },
  { value: 'tool', label: '工具 / 生產力' },
  { value: 'other', label: '其他' },
];

export function AddModal({ open, onClose, onAdd }: AddModalProps) {
  const [form, setForm] = useState<ProjectFormValues>(EMPTY_FORM);

  const update = <K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = () => {
    const name = form.name.trim();
    if (!name) {
      alert('請填寫項目名稱');
      return;
    }

    // category → relevance 對應（沿用原邏輯）
    const relevance: string[] = [];
    if (form.category === 'edu') relevance.push('2');
    if (form.category === 'decision' || form.category === 'health') relevance.push('5');

    const project: Project = {
      id: Date.now(),
      name,
      source: form.source,
      category: form.category,
      url: form.url.trim() || null,
      desc: form.desc,
      notes: form.notes,
      funding: form.funding,
      signal: form.signal,
      aiScore: null,
      relevance,
      date: new Date().toISOString().slice(0, 7),
      signalType: deriveSignalType(form.source),
    };

    onAdd(project);
    setForm(EMPTY_FORM);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <h2 style={{ marginBottom: 18 }}>新增追蹤項目</h2>

      <div className="form-group">
        <label className="form-label">項目名稱 *</label>
        <input
          className="form-input"
          placeholder="e.g. Harvey AI、某 YC 項目..."
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">來源</label>
          <select
            className="form-select"
            value={form.source}
            onChange={(e) => update('source', e.target.value)}
          >
            {SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">主要類別</label>
          <select
            className="form-select"
            value={form.category}
            onChange={(e) => update('category', e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">官方網址</label>
        <input
          className="form-input"
          placeholder="https://..."
          value={form.url}
          onChange={(e) => update('url', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">項目描述（越詳細 AI 分析越準）</label>
        <textarea
          className="form-textarea"
          placeholder="這個項目在做什麼？解決什麼問題？商業模式是？"
          value={form.desc}
          onChange={(e) => update('desc', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">你的初步觀察 / 疑問</label>
        <textarea
          className="form-textarea"
          placeholder="你覺得它哪裡有意思？哪裡有問題？"
          style={{ minHeight: 60 }}
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">主打指標（融資 / ⭐star/day / ▲upvotes）</label>
          <input
            className="form-input"
            placeholder="e.g. $3M Seed、⭐ 800/day、▲ 320"
            value={form.funding}
            onChange={(e) => update('funding', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">初步信號強度（1–5）</label>
          <select
            className="form-select"
            value={form.signal}
            onChange={(e) => update('signal', parseInt(e.target.value, 10))}
          >
            <option value={5}>5 — 非常強</option>
            <option value={4}>4 — 強</option>
            <option value={3}>3 — 中等</option>
            <option value={2}>2 — 弱</option>
            <option value={1}>1 — 待觀察</option>
          </select>
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        加入追蹤清單
      </button>
    </Modal>
  );
}
