export function InsightBar({ text }: { text: string }) {
  return (
    <div className="insight-bar">
      <div className="insight-label">→ 本週信號</div>
      <div className="insight-text">{text}</div>
    </div>
  );
}
