import type { CSSProperties } from 'react';
import type { Project } from '../types';
import { CAT_COLORS, CAT_LABELS, TAG_CLASS } from '../constants';
import { LinkIcon } from './LinkIcon';

interface ProjectCardProps {
  project: Project;
  onOpen: (id: number) => void;
}

export function ProjectCard({ project: p, onOpen }: ProjectCardProps) {
  const color = CAT_COLORS[p.category] || '#8a8778';
  const scoreColor =
    p.aiScore != null && p.aiScore >= 80
      ? '#1a7a4a'
      : p.aiScore != null && p.aiScore >= 60
        ? '#92700a'
        : '#c0392b';

  const dotClass = (i: number) => {
    if (i > p.signal) return '';
    if (p.signal >= 4) return 'on';
    if (p.signal >= 3) return 'on-3';
    return 'on-2';
  };

  return (
    <div
      className="project-card"
      style={{ '--tag-color': color } as CSSProperties}
      onClick={() => onOpen(p.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div className="proj-name">{p.name}</div>
          <div className="proj-meta">
            {(p.funding || '融資未知') + ' · ' + (p.date || '—')}
          </div>
        </div>
        {p.url && (
          <a
            className="link-btn"
            href={p.url}
            target="_blank"
            rel="noopener"
            onClick={(e) => e.stopPropagation()}
          >
            <LinkIcon /> 官網
          </a>
        )}
      </div>

      <div className="source-badge">{p.source}</div>

      <div>
        <span className={`tag ${TAG_CLASS[p.category]}`}>{CAT_LABELS[p.category]}</span>
      </div>

      <div className="signal">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`signal-dot ${dotClass(i)}`} />
        ))}
      </div>

      <div className="relevance-wrap">
        {p.relevance.length ? (
          p.relevance.map((r) => {
            if (r === '2')
              return (
                <span key={r} className="rel-tag rel-2">
                  ② 教育
                </span>
              );
            if (r === '5')
              return (
                <span key={r} className="rel-tag rel-5">
                  ⑤ 決策
                </span>
              );
            return null;
          })
        ) : (
          <span style={{ color: 'var(--muted)', fontSize: 11 }}>—</span>
        )}
      </div>

      <div className="score-wrap" style={{ '--bar-color': scoreColor } as CSSProperties}>
        <div className="score-bar-bg">
          <div className="score-bar-fill" style={{ width: `${p.aiScore || 0}%` }} />
        </div>
        <div className="score-num">{p.aiScore ?? '?'}</div>
      </div>
    </div>
  );
}
