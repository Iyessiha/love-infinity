export function Logo({ width = 240 }: { width?: number }) {
  return (
    <svg viewBox="0 0 240 230" width={width} height={(width * 230) / 240} role="img" aria-label="Logo Love Infinity">
      <defs>
<linearGradient id="li-p" x1="30" y1="40" x2="170" y2="190" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#8A2470"/><stop offset=".45" stopColor="#5E1A5C"/><stop offset="1" stopColor="#E0662B"/></linearGradient>
<linearGradient id="li-q" x1="210" y1="40" x2="80" y2="200" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#F6C453"/><stop offset=".6" stopColor="#F0993A"/><stop offset="1" stopColor="#DC6A2B"/></linearGradient>
<mask id="li-m" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="230"><rect width="240" height="230" fill="#fff"/>
<path d="M96 118 C108 106 116 98 124 90 C136 76 146 62 160 52" fill="none" stroke="#000" strokeWidth="38" strokeLinecap="butt"/></mask>
</defs>
<g fill="none" strokeLinecap="butt" strokeLinejoin="round" strokeWidth="28">
<path mask="url(#li-m)" stroke="url(#li-p)" d="M172 142 C156 128 136 110 116 90 C96 68 80 44 52 44 C22 46 20 92 44 124 C60 146 90 176 118 202"/>
<path strokeLinecap="round" stroke="url(#li-q)" d="M68 144 C84 130 104 110 124 90 C144 68 160 44 188 44 C218 46 220 92 196 124 C180 146 150 176 122 202"/>
</g>
    </svg>
  );
}
