import { requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CompteSuspendu() {
  const { user } = await requireUser();
  return (
    <main className="ph">
      <h1>Compte indisponible</h1>
      <p className="sub">Le compte {user.email} est suspendu ou fermé après un contrôle de notre équipe. Pour demander un réexamen, écris-nous à l’adresse indiquée sur la page de contact.</p>
      <form action="/auth/signout" method="post"><button className="btn ghost" type="submit">Me déconnecter</button></form>
    </main>
  );
}
