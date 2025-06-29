import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bienvenue sur BlockDeploy</h1>
      <p>La plateforme nouvelle génération pour vos applications décentralisées.</p>
      <div style={{ marginTop: '30px' }}>
        <Link href="/dapp-builder/default" style={{ fontSize: '1.2em', color: '#00A8FF', textDecoration: 'underline' }}>
          Accéder au dApp Builder
        </Link>
      </div>
      <footer style={{ marginTop: '50px', fontSize: '0.8em', color: '#A0AEC0' }}>
        <p>Version Alpha - Next.js App Router</p>
      </footer>
    </main>
  );
}
