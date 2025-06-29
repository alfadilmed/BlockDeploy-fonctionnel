import MainEditorLayout from '@/src/modules/dapp-builder/editor-ui/MainEditorLayout'; // Ajustez le chemin si nécessaire

interface DappBuilderPageProps {
  params: {
    slug: string;
  };
}

export default function DappBuilderPage({ params }: DappBuilderPageProps) {
  return <MainEditorLayout initialSlug={params.slug} />;
}
