import '@/app/membre.css';

export default function Chargement() {
  return (
    <main className="mb" aria-busy="true">
      <div className="sk sk-ligne" style={{ width: 160, height: 28 }} />
      {[0, 1, 2, 3].map((n) => <div key={n} className="sk" style={{ height: 76 }} />)}
    </main>
  );
}
