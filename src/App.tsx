import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { FilterKey, ParsedProject, Project } from './types';
import { useProjectStore } from './hooks/useProjectStore';
import { buildInsight, deriveStats, filterProjects, sanitizeImportedProjects } from './utils';
import { Header } from './components/Header';
import { InsightBar } from './components/InsightBar';
import { Controls } from './components/Controls';
import { ProjectList } from './components/ProjectList';
import { DetailModal } from './components/DetailModal';
import { AddModal } from './components/AddModal';
import { ImportModal } from './components/ImportModal';

export default function App() {
  const [projects, setProjects, store] = useProjectStore();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [detailId, setDetailId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterProjects(projects, filter), [projects, filter]);
  const stats = useMemo(() => deriveStats(projects), [projects]);
  const insight = useMemo(() => buildInsight(projects), [projects]);

  const selected = detailId != null ? projects.find((p) => p.id === detailId) ?? null : null;

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const importProjects = (items: ParsedProject[]) => {
    const ym = new Date().toISOString().slice(0, 7);
    const base = Date.now();
    // base + index 避免同批多筆共用同一個 Date.now() 而 id 撞號
    const additions: Project[] = items.map((it, i) => ({ ...it, id: base + i, date: ym }));
    setProjects((prev) => [...additions, ...prev]);
  };

  const deleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDetailId(null);
  };

  // 匯出：把目前所有項目下載成 JSON 備份檔
  const exportBackup = () => {
    const json = JSON.stringify(projects, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal-lab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 還原：選 JSON 檔 → 合併進現有清單（同名略過，id 撞號自動換新）
  const handleRestoreFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // 清空，允許重複選同一檔
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let incoming: Project[];
      try {
        incoming = sanitizeImportedProjects(JSON.parse(String(reader.result)));
      } catch {
        window.alert('JSON 解析失敗，請確認是有效的備份檔。');
        return;
      }
      if (!incoming.length) {
        window.alert('備份檔裡沒有可匯入的項目。');
        return;
      }

      const names = new Set(projects.map((p) => p.name.toLowerCase()));
      const ids = new Set(projects.map((p) => p.id));
      let counter = Date.now();
      const additions: Project[] = [];
      for (const p of incoming) {
        const key = p.name.toLowerCase();
        if (names.has(key)) continue;
        names.add(key);
        let id = p.id;
        if (id === 0 || ids.has(id)) id = counter++;
        ids.add(id);
        additions.push({ ...p, id, date: p.date || new Date().toISOString().slice(0, 7) });
      }

      if (additions.length) setProjects((prev) => [...additions, ...prev]);
      window.alert(
        additions.length
          ? `已還原 ${additions.length} 筆（略過 ${incoming.length - additions.length} 筆重複）。`
          : '沒有新項目可匯入（全部與現有重複）。',
      );
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="wrap">
        <Header stats={stats} />
        {store.mode === 'local' && (
          <div
            style={{
              margin: '8px 0',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 13,
              background: 'rgba(192, 90, 16, 0.12)',
              border: '1px solid rgba(192, 90, 16, 0.4)',
              color: '#c05a10',
            }}
          >
            📦 部署版：變更只暫存在這個瀏覽器（localStorage），不會寫回 repo。要編輯並同步請在本機跑
            <code style={{ margin: '0 4px' }}>npm run dev</code>，改完 git commit / push。
          </div>
        )}
        {store.error && (
          <div
            style={{
              margin: '8px 0',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 13,
              background: 'rgba(192, 57, 43, 0.12)',
              border: '1px solid rgba(192, 57, 43, 0.4)',
              color: '#c0392b',
            }}
          >
            ⚠️ 存檔失敗：{store.error}（dev 伺服器是否在執行？）
          </div>
        )}
        <InsightBar text={insight} />
        <Controls
          filter={filter}
          onFilter={setFilter}
          onAdd={() => setAddOpen(true)}
          onImport={() => setImportOpen(true)}
          onExport={exportBackup}
          onRestore={() => fileInputRef.current?.click()}
        />
        <ProjectList projects={filtered} onOpen={setDetailId} />
      </div>

      <DetailModal project={selected} onClose={() => setDetailId(null)} onDelete={deleteProject} />
      <AddModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addProject} />
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        existingNames={projects.map((p) => p.name)}
        onImport={importProjects}
      />

      {/* 隱藏的檔案選擇器，供「還原」按鈕觸發 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={handleRestoreFile}
      />
    </>
  );
}
