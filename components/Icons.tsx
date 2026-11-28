const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
export const Check = ({ size = 16 }: { size?: number }) => <svg {...p} width={size} height={size} style={{ verticalAlign: '-2px' }}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const Chevron = () => <svg {...p} width={18} height={18} strokeWidth={2.4}><path d="M15 5l-7 7 7 7" /></svg>;

const s = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
type P = { size?: number };
export const HeartIcon = ({ size = 24, filled = true }: P & { filled?: boolean }) => <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 2} strokeLinejoin="round"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5.5 6.2 5.5c2 0 3.3 1.1 4.1 2.4l1.7 2.4 1.7-2.4c.8-1.3 2.1-2.4 4.1-2.4 3.2 0 5 3.1 3.7 6.3C19.5 16.4 12 21 12 21z" /></svg>;
export const XIcon = ({ size = 24 }: P) => <svg {...s} width={size} height={size} strokeWidth={2.6}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const MsgIcon = ({ size = 24 }: P) => <svg {...s} width={size} height={size}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>;
export const InfoIcon = ({ size = 22 }: P) => <svg {...s} width={size} height={size}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>;
export const SlidersIcon = ({ size = 22 }: P) => <svg {...s} width={size} height={size}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>;
export const CompassIcon = ({ size = 24 }: P) => <svg {...s} width={size} height={size}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></svg>;
export const UserIcon = ({ size = 24 }: P) => <svg {...s} width={size} height={size}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg>;
export const PinIcon = ({ size = 16 }: P) => <svg {...s} width={size} height={size}><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>;
export const BriefcaseIcon = ({ size = 16 }: P) => <svg {...s} width={size} height={size}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></svg>;
export const CapIcon = ({ size = 16 }: P) => <svg {...s} width={size} height={size}><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /></svg>;
export const RulerIcon = ({ size = 16 }: P) => <svg {...s} width={size} height={size}><path d="M12 3v18M8 6l4-3 4 3M8 18l4 3 4-3" /></svg>;
export const GlobeIcon = ({ size = 16 }: P) => <svg {...s} width={size} height={size}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
export const TargetIcon = ({ size = 16 }: P) => <svg {...s} width={size} height={size}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></svg>;
export const ShieldIcon = ({ size = 16 }: P) => <svg {...s} width={size} height={size} strokeWidth={2.4}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.500 12l2.500 2.500 4.500-5" /></svg>;
export const LockIcon = ({ size = 18 }: P) => <svg {...s} width={size} height={size}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
export const FlagIcon = ({ size = 18 }: P) => <svg {...s} width={size} height={size}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></svg>;
export const SendIcon = ({ size = 20 }: P) => <svg {...s} width={size} height={size}><path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" /></svg>;
export const ChevronDown = ({ size = 20 }: P) => <svg {...s} width={size} height={size} strokeWidth={2.4}><path d="M6 9l6 6 6-6" /></svg>;
export const ChevronLeft = ({ size = 22 }: P) => <svg {...s} width={size} height={size} strokeWidth={2.4}><path d="M15 5l-7 7 7 7" /></svg>;
export const SettingsIcon = ({ size = 22 }: P) => <svg {...s} width={size} height={size}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
export const ChevronRight = ({ size = 22 }: P) => <svg {...s} width={size} height={size} strokeWidth={2.4}><path d="M9 5l7 7-7 7" /></svg>;

export function CrownIcon({ size = 16 }: { size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z" /></svg>);
}
