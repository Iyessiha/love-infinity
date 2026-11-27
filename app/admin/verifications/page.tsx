import Link from 'next/link';
import { dateHeure, nombre, pays, requireAdmin, age as calcAge } from '@/lib/admin';
import { GENRE_LABEL, KIND_LABEL, type Kind } from '@/lib/verification';

export const dynamic = 'force-dynamic';

const PAR_PAGE = 25;
const FILTRES = [['', 'Tout'], ['photos', 'Photos'], ['selfie', 'Selfies vidéo'], ['document', 'Pièces d’identité']] as const;
const MESSAGES: Record<string, string> = { approved: 'Demande validée.', rejected: 'Demande refusée.' };

type Ligne = { user_id: string; prenom: string | null; nom: string | null; birth_date: string | null; genre: string | null; ville: string | null; phone_country: string | null; kinds: string[]; plus_ancienne: string; nb: number; total: number };

const attenteTexte = (h: number) => (h < 1 ? '< 1 h' : h < 48 ? `${h} h` : `${Math.floor(h / 24)} j`);

export default async function File({ searchParams }: { searchParams: Promise<{ kind?: string; q?: string; page?: string; m?: string; fini?: string; vue?: string }> }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const kind = ['photos', 'selfie', 'document'].includes(sp.kind ?? '') ? sp.kind! : '';
  const q = (sp.q ?? '').trim().slice(0, 40);
  const page = Math.max(1, Number(sp.page) || 1);
  const historique = sp.vue === 'historique';

  const debutJour = new Date(); debutJour.setUTCHours(0, 0, 0, 0);
  const [{ data: lignes }, { data: stats }, { count: traiteesJour }] = await Promise.all([
    supabase.rpc('admin_file_verifications', { p_kind: kind || null, p_q: q || null, p_limite: PAR_PAGE, p_decalage: (page - 1) * PAR_PAGE }),
    supabase.rpc('admin_stats'),
    supabase.from('verifications').select('id', { count: 'exact', head: true }).gte('reviewed_at', debutJour.toISOString()).in('status', ['approved', 'rejected']),
  ]);
  const file = (lignes ?? []) as Ligne[];
  const total = file[0]?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAR_PAGE));
  const parType = (stats as { verifs: { kind: string; n: number; heures: number }[] } | null)?.verifs ?? [];
  const enAttente = parType.reduce((a, v) => a + Number(v.n), 0);
  const plusAncien = Math.max(0, ...parType.map((v) => Number(v.heures)));

  let hist: { id: string; user_id: string; kind: string; status: string; reason: string | null; reviewed_at: string; prenom?: string | null; nom?: string | null }[] = [];
  if (historique) {
    const { data } = await supabase.from('verifications').select('id, user_id, kind, status, reason, reviewed_at').in('status', ['approved', 'rejected']).order('reviewed_at', { ascending: false }).limit(60);
    const ids = [...new Set((data ?? []).map((h) => h.user_id))];
    const { data: noms } = ids.length ? await supabase.from('profiles').select('id, prenom, nom').in('id', ids) : { data: [] as { id: string; prenom: string | null; nom: string | null }[] };
    const mapNoms = new Map((noms ?? []).map((n) => [n.id, n]));
    hist = (data ?? []).map((h) => ({ ...h, prenom: mapNoms.get(h.user_id)?.prenom, nom: mapNoms.get(h.user_id)?.nom }));
  }

  const lien = (o: { kind?: string; q?: string; page?: number; vue?: string }) => {
    const p = new URLSearchParams();
    const k = o.kind ?? kind; const qq = o.q ?? q;
    if (k) p.set('kind', k); if (qq) p.set('q', qq); if (o.page && o.page > 1) p.set('page', String(o.page)); if (o.vue) p.set('vue', o.vue);
    const s = p.toString();
    return `/admin/verifications${s ? `?${s}` : ''}`;
  };
  const premier = file[0]?.user_id;

  return (
    <>
      <header className="adm-row">
        <div>
          <h1>Vérifications</h1>
          <p className="lede">Les dossiers les plus anciens sont en haut. Ouvre-en un : après chaque décision, le suivant s’affiche tout seul.</p>
        </div>
        <div className="adm-sp" />
        {premier && !historique && <Link className="adm-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} href={`/admin/verifications/${premier}${kind ? `?kind=${kind}` : ''}`}>Commencer la revue</Link>}
      </header>

      {sp.fini && <div className="adm-ok" role="status">{MESSAGES[sp.m ?? ''] ?? 'Décision enregistrée.'} La file est maintenant vide. Beau travail.</div>}

      <div className="adm-tiles">
        <div className={`adm-tile ${enAttente > 0 ? 'warn' : 'good'}`}><b>{nombre(enAttente)}</b><span>Demandes en attente</span></div>
        <div className={`adm-tile ${plusAncien >= 48 ? 'warn' : ''}`}><b>{plusAncien < 1 ? '—' : attenteTexte(plusAncien)}</b><span>Attente la plus longue</span></div>
        <div className="adm-tile good"><b>{nombre(traiteesJour)}</b><span>Traitées aujourd’hui</span></div>
        {parType.map((v) => <div className="adm-tile" key={v.kind}><b>{nombre(v.n)}</b><span>{KIND_LABEL[v.kind as Kind] ?? v.kind}</span></div>)}
      </div>

      <div className="adm-row">
        <div className="adm-chips" role="group" aria-label="Filtrer par type">
          {FILTRES.map(([v, l]) => <Link key={v} href={lien({ kind: v })} aria-current={!historique && kind === v}>{l}</Link>)}
          <Link href={lien({ vue: 'historique' })} aria-current={historique}>Historique</Link>
        </div>
        <div className="adm-sp" />
        {!historique && (
          <form method="get" className="adm-row" style={{ gap: 8 }}>
            {kind && <input type="hidden" name="kind" value={kind} />}
            <label className="muted" htmlFor="q">Chercher</label>
            <input id="q" name="q" className="adm-input" defaultValue={q} placeholder="Prénom, nom ou ville" />
            <button className="adm-btn ghost" type="submit">Chercher</button>
          </form>
        )}
      </div>

      {historique ? (
        <section className="adm-card" aria-labelledby="h-h">
          <h2 id="h-h">60 dernières décisions</h2>
          {hist.length === 0 ? <p className="adm-empty">Aucune décision pour l’instant.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Date</th><th>Membre</th><th>Type</th><th>Décision</th><th>Motif</th></tr></thead>
              <tbody>{hist.map((h) => (
                <tr key={h.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{dateHeure(h.reviewed_at)}</td>
                  <td>{h.prenom} {h.nom}</td>
                  <td>{KIND_LABEL[h.kind as Kind] ?? h.kind}</td>
                  <td><span className={`adm-pill ${h.status === 'approved' ? 'good' : 'bad'}`}>{h.status === 'approved' ? 'Validée' : 'Refusée'}</span></td>
                  <td>{h.reason ?? '—'}</td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </section>
      ) : (
        <section className="adm-card" aria-labelledby="h-f">
          <h2 id="h-f">{nombre(total)} dossier(s) en attente{kind ? ` : ${KIND_LABEL[kind as Kind].toLowerCase()}` : ''}{q ? ` pour « ${q} »` : ''}</h2>
          {file.length === 0 ? <p className="adm-empty">Aucun dossier en attente. Rien à faire pour le moment.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Membre</th><th>Âge</th><th>Pays</th><th>À vérifier</th><th>Attente</th><th></th></tr></thead>
              <tbody>{file.map((l) => {
                const h = Math.round((Date.now() - new Date(l.plus_ancienne).getTime()) / 3600000);
                const ans = calcAge(l.birth_date);
                return (
                  <tr key={l.user_id}>
                    <td><b>{l.prenom} {l.nom}</b><div className="muted">{GENRE_LABEL[l.genre ?? ''] ?? ''}{l.ville ? ` · ${l.ville}` : ''}</div></td>
                    <td>{ans ?? '—'}</td>
                    <td>{pays(l.phone_country)}</td>
                    <td>{l.kinds.map((k) => <span key={k} className="adm-pill" style={{ marginRight: 4 }}>{KIND_LABEL[k as Kind] ?? k}</span>)}</td>
                    <td><span className={`adm-pill ${h >= 48 ? 'bad' : h >= 24 ? 'warn' : ''}`} title={dateHeure(l.plus_ancienne)}>{attenteTexte(h)}</span></td>
                    <td><Link className="adm-btn ghost sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} href={`/admin/verifications/${l.user_id}${kind ? `?kind=${kind}` : ''}`}>Examiner</Link></td>
                  </tr>
                );
              })}</tbody>
            </table></div>
          )}
          {pages > 1 && (
            <nav className="adm-row" style={{ marginTop: 14 }} aria-label="Pages">
              {page > 1 ? <Link className="adm-btn ghost sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} href={lien({ page: page - 1 })}>Précédent</Link> : <span />}
              <span className="muted">Page {page} sur {pages}</span>
              {page < pages ? <Link className="adm-btn ghost sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} href={lien({ page: page + 1 })}>Suivant</Link> : null}
            </nav>
          )}
        </section>
      )}
    </>
  );
}
