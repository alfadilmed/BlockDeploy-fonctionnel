import './globals.css'; // Assurez-vous de créer ce fichier CSS de base

export const metadata = {
  title: 'BlockDeploy',
  description: 'Créez et déployez vos DApps facilement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
