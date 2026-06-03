import type { Stats } from '../utils';

export function Header({ stats }: { stats: Stats }) {
  return (
    <header>
      <div className="header-inner">
        <div>
          <div className="logo">
            Signal Lab <span>/ 項目情報站</span>
          </div>
          <div className="tagline">
            CROWDFUNDING · INVESTMENT · EMERGING AI · WEEKLY SCAN
          </div>
        </div>
        <div className="header-stats">
          <div className="stat">
            <div className="stat-val">{stats.total}</div>
            <div className="stat-label">追蹤項目</div>
          </div>
          <div className="stat">
            <div className="stat-val">{stats.highSignal}</div>
            <div className="stat-label">高信號</div>
          </div>
          <div className="stat">
            <div className="stat-val">{stats.avgScore}</div>
            <div className="stat-label">平均分</div>
          </div>
        </div>
      </div>
    </header>
  );
}
