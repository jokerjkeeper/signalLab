/** 外部連結 SVG 圖示（取代原 ICON_LINK 字串，避免 innerHTML） */
export function LinkIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path
        d="M7 1h4v4M11 1L5.5 6.5M4 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
