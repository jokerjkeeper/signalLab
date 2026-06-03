import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onOpen: (id: number) => void;
}

export function ProjectList({ projects, onOpen }: ProjectListProps) {
  return (
    <>
      <div className="table-head">
        <div>項目</div>
        <div>來源</div>
        <div>類別</div>
        <div>信號強度</div>
        <div>相關方向</div>
        <div>AI評分</div>
      </div>

      <div id="project-list">
        {projects.length === 0 ? (
          <div className="empty">// 沒有符合條件的項目 — 新增一個？</div>
        ) : (
          projects.map((p) => <ProjectCard key={p.id} project={p} onOpen={onOpen} />)
        )}
      </div>
    </>
  );
}
