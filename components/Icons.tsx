const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
export const Check = ({ size = 16 }: { size?: number }) => <svg {...p} width={size} height={size} style={{ verticalAlign: '-2px' }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const Chevron = () => <svg {...p} width={18} height={18} strokeWidth={2.4}><path d="M15 5l-7 7 7 7" /></svg>;
