'use client';
import { useT } from '@/components/I18n';

/** Choix par pastilles : un seul (unique) ou plusieurs (multi, avec un maximum). */
export function Chips<T extends string>({
  options, value, onChange, max,
}: {
  options: readonly (readonly [T, string])[] | readonly T[];
  value: T | T[] | undefined;
  onChange: (v: any) => void;
  max?: number;
}) {
  const t = useT();
  const multi = Array.isArray(value);
  const items = (options as readonly any[]).map((o) => (Array.isArray(o) ? o : [o, o])) as [T, string][];
  const actif = (k: T) => (multi ? (value as T[]).includes(k) : value === k);
  function clic(k: T) {
    if (!multi) return onChange(k);
    const v = value as T[];
    if (v.includes(k)) return onChange(v.filter((x) => x !== k));
    if (max && v.length >= max) return;
    onChange([...v, k]);
  }
  return (
    <div className="wrap" role="group">
      {items.map(([k, label]) => (
        <button key={k} type="button" className={`chip${actif(k) ? ' on' : ''}`} aria-pressed={actif(k)} onClick={() => clic(k)}>{t.v(String(k)) !== String(k) ? t.v(String(k)) : label}</button>
      ))}
    </div>
  );
}
