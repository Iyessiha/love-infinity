export function Logo({ width = 240 }: { width?: number }) {
  return (
    <svg viewBox="-75 -50 150 100" width={width} height={(width * 2) / 3} role="img" aria-label="Logo Love Infinity">
      <g fill="none" strokeWidth="9" strokeLinecap="round">
        <path d="M0,0 C-20,-30 -66,-30 -66,0 C-66,30 -20,30 0,0" stroke="#4A0E2E" />
        <path d="M0,0 C20,-30 66,-30 66,0 C66,30 20,30 0,0" stroke="#D4A24C" />
      </g>
      <circle cx="0" cy="0" r="12" fill="#2E8B57" stroke="#FBF6EE" strokeWidth="3" />
      <path d="M-5,0.5 L-1.5,4 L5.5,-4" fill="none" stroke="#FBF6EE" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
