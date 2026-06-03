import { useMemo, useState } from 'react';
import type { FilterKey, ParsedProject, Project } from './types';
import { DEMO_PROJECTS, STORAGE_KEY } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { buildInsight, deriveStats, filterProjects } from './utils';
import { Header } from './components/Header';
import { InsightBar } from './components/InsightBar';
import { Controls } from './components/Controls';
import { ProjectList } from './components/ProjectList';
import { DetailModal } from './components/DetailModal';
import { AddModal } from './components/AddModal';
import { ImportModal } from './components/ImportModal';

export default function App() {
  const [projects, setProjects] = useLocalStorage<Project[]>(STORAGE_KEY, DEMO_PROJECTS);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [detailId, setDetailId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

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

  return (
    <>
      <div className="wrap">
        <Header stats={stats} />
        <InsightBar text={insight} />
        <Controls
          filter={filter}
          onFilter={setFilter}
          onAdd={() => setAddOpen(true)}
          onImport={() => setImportOpen(true)}
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
    </>
  );
}
