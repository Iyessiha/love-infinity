import Link from 'next/link';
import { fcfa, nombre, pays, MOTIFS_SIGNALEMENT, type Stats } from '@/lib/admin';
import { KIND_LABEL, type Kind } from '@/lib/verification';

export default function AdminOverview({ s, email, lien }: { s: Stats; email?: string | null; lien?: string }) {
  const k = s.kpis;
  const aTraiter = k.verifs + k.signalements;

  const jours = s.inscriptions;
  const max = Math.max(1, ...jours.map((j) => j.n));
  const W = 640, H = 180, ml = 28, mb = 24, mt = 10;
  const bw = (W - ml) / Math.max(jours.length, 1);
  const total30 = jours.reduce((a, j) => a + j.n, 0);
  const pct = (n: number) => (k.profils ? Math.round((n / k.profils) * 100) : 0);

  return (
    <>
      <header>
        <h1>Vue d’ensemble</h1>
        <p className="lede">
          {aTraiter > 0
            ? <>Il y a <b>{k.verifs}</b> vérification(s) et <b>{k.signalements}</b> signalement(s) à traiter.</>
            : 'Rien n’attend une décision pour le moment.'}{' '}
          <span className="muted">Connecté : {email}</span>
        </p>
      </header>

      <section aria-labelledby="h-cles">
        <h2 id="h-cles">Chiffres clés</h2>
        <div className="adm-tiles">
          <Link href="/admin/membres" className="adm-tile"><b>{nombre(k.profils)}</b><span>Comptes créés</span></Link>
          <Link href="/admin/membres?statut=active" className="adm-tile good"><b>{nombre(k.actifs)}</b><span>Comptes actifs</span></Link>
          <div className="adm-tile"><b>{nombre(k.inscrits_7j)}</b><span>Inscrits ces 7 derniers jours</span></div>
          <Link href="/admin/verifications" className={`adm-tile ${k.verifs > 0 ? 'warn' : ''}`}><b>{nombre(k.verifs)}</b><span>Vérifications à traiter</span></Link>
          <Link href="/admin/signalements" className={`adm-tile ${k.signalements > 0 ? 'warn' : ''}`}><b>{nombre(k.signalements)}</b><span>Signalements ouverts</span></Link>
          <div className="adm-tile"><b>{nombre(k.matchs)}</b><span>Matchs</span></div>
          <div className="adm-tile"><b>{nombre(k.messages)}</b><span>Messages envoyés</span></div>
          <Link href="/admin/paiements" className="adm-tile"><b>{nombre(k.abonnes)}</b><span>Abonnés actifs</span></Link>
          <Link href="/admin/paiements" className="adm-tile good"><b>{nombre(k.revenus)}</b><span>Revenus encaissés (FCFA)</span></Link>
          <div className="adm-tile"><b>{nombre(k.revenus_30j)}</b><span>Revenus des 30 derniers jours (FCFA)</span></div>
          <div className="adm-tile"><b>{nombre(k.liste_attente)}</b><span>Liste d’attente (pays pas encore ouverts)</span></div>
          <div className="adm-tile"><b>{nombre(k.suspendus)}</b><span>Comptes suspendus ou bannis</span></div>
        </div>
      </section>

      <section className="adm-card" aria-labelledby="h-ins">
        <div className="adm-row"><h2 id="h-ins" style={{ margin: 0 }}>Inscriptions des 30 derniers jours</h2><div className="adm-sp" /><span className="muted">{nombre(total30)} au total</span></div>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Inscriptions par jour sur 30 jours, ${total30} au total, maximum ${max} en un jour`} style={{ width: '100%', height: 'auto', marginTop: 12, display: 'block' }}>
          {[0, 0.5, 1].map((t) => {
            const y = mt + (H - mt - mb) * (1 - t);
            return (
              <g key={t}>
                <line x1={ml} x2={W} y1={y} y2={y} stroke="#E6D6CC" />
                <text x={ml - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#5E4A53">{Math.round(max * t)}</text>
              </g>
            );
          })}
          {jours.map((j, i) => {
            const h = ((H - mt - mb) * j.n) / max;
            return (
              <rect key={j.jour} x={ml + i * bw + 2} width={Math.max(bw - 4, 2)} y={H - mb - h} height={h} rx="2" fill="#4A0E2E">
                <title>{`${j.jour} : ${j.n} inscription(s)`}</title>
              </rect>
            );
          })}
          <text x={ml} y={H - 6} fontSize="11" fill="#5E4A53">{jours[0]?.jour}</text>
          <text x={W} y={H - 6} fontSize="11" fill="#5E4A53" textAnchor="end">{jours[jours.length - 1]?.jour}</text>
        </svg>
      </section>

      <div className="adm-grid">
        <section className="adm-card" aria-labelledby="h-niv">
          <h2 id="h-niv">Niveaux de vérification</h2>
          {[
            ['Photos vérifiées (niveau 1 et plus)', k.niveau1],
            ['Selfie vidéo vérifié (niveau 2 et plus)', k.niveau2],
            ['Identité vérifiée (niveau 3)', k.niveau3],
          ].map(([label, n]) => (
            <div key={label as string} style={{ marginBottom: 12 }}>
              <div className="adm-row"><span style={{ fontSize: 14.5 }}>{label}</span><div className="adm-sp" /><b>{nombre(n as number)} · {pct(n as number)} %</b></div>
              <div className="adm-bar" aria-hidden="true"><i style={{ width: `${pct(n as number)}%` }} /></div>
            </div>
          ))}
        </section>

        <section className="adm-card" aria-labelledby="h-ver">
          <h2 id="h-ver">Vérifications en attente</h2>
          {s.verifs.length === 0 ? <p className="adm-empty">Aucune demande en attente.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Type</th><th className="num">Demandes</th><th className="num">Attente max (h)</th></tr></thead>
              <tbody>{s.verifs.map((v) => <tr key={v.kind}><td>{KIND_LABEL[v.kind as Kind] ?? v.kind}</td><td className="num">{nombre(v.n)}</td><td className="num">{nombre(v.heures)}</td></tr>)}</tbody>
            </table></div>
          )}
          <p className="note"><Link href="/admin/verifications">Traiter les vérifications</Link></p>
        </section>

        <section className="adm-card" aria-labelledby="h-sig">
          <h2 id="h-sig">Signalements ouverts</h2>
          {s.signalements.length === 0 ? <p className="adm-empty">Aucun signalement ouvert.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Motif</th><th className="num">Nombre</th></tr></thead>
              <tbody>{s.signalements.map((v) => <tr key={v.reason}><td>{MOTIFS_SIGNALEMENT[v.reason] ?? v.reason}</td><td className="num">{nombre(v.n)}</td></tr>)}</tbody>
            </table></div>
          )}
          <p className="note"><Link href="/admin/signalements">Traiter les signalements</Link></p>
        </section>

        <section className="adm-card" aria-labelledby="h-rev">
          <h2 id="h-rev">Revenus par mois</h2>
          {s.revenus_mois.length === 0 ? <p className="adm-empty">Aucun paiement encaissé pour l’instant.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Mois</th><th className="num">Paiements</th><th className="num">Montant</th></tr></thead>
              <tbody>{s.revenus_mois.map((v) => <tr key={v.mois}><td>{v.mois}</td><td className="num">{nombre(v.n)}</td><td className="num">{fcfa(v.xof)}</td></tr>)}</tbody>
            </table></div>
          )}
        </section>

        <section className="adm-card" aria-labelledby="h-pays">
          <h2 id="h-pays">Membres par pays</h2>
          {s.pays.length === 0 ? <p className="adm-empty">Aucun pays enregistré.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Pays</th><th className="num">Membres</th></tr></thead>
              <tbody>{s.pays.map((v) => <tr key={v.country}><td>{pays(v.country)}</td><td className="num">{nombre(v.n)}</td></tr>)}</tbody>
            </table></div>
          )}
        </section>

        <section className="adm-card" aria-labelledby="h-att">
          <h2 id="h-att">Liste d’attente par pays</h2>
          {s.attente_pays.length === 0 ? <p className="adm-empty">Personne en liste d’attente.</p> : (
            <div className="adm-table-wrap"><table>
              <thead><tr><th>Pays</th><th className="num">Inscrits</th></tr></thead>
              <tbody>{s.attente_pays.map((v) => <tr key={v.country}><td>{pays(v.country)}</td><td className="num">{nombre(v.n)}</td></tr>)}</tbody>
            </table></div>
          )}
        </section>
      </div>

      {lien ? <p className="note"><a href={lien} target="_blank" rel="noopener noreferrer">Ouvrir aussi le tableau de bord dans Claude</a></p> : null}
      <p className="note">Aucun email ni numéro de téléphone n’apparaît sur cette page, seulement des totaux.</p>
    </>
  );
}
