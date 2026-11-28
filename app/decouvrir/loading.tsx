import '@/app/membre.css';

export default function Chargement() {
  return (
    <main className="mb" style={{ height: '100dvh' }} aria-busy="true">
      <div className="sk sk-ligne" style={{ width: 140, height: 26 }} />
      <div className="sk sk-carte" />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 22 }}><div className="sk sk-rond" /><div className="sk sk-rond" /><div className="sk sk-rond" /></div>
    </main>
  );
}
