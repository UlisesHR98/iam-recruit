import { PostulationDetailsContent } from "@/components/applications/postulation-detail-content";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostulacionDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PostulationDetailsContent id={id} />;
}
