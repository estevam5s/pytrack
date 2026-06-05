import { getYoutubeContent } from "@/lib/data/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { YoutubeView } from "@/components/dashboard/youtube-view";

export const metadata = { title: "Aulas do YouTube · PyTrack" };

export default async function YoutubePage() {
  const items = await getYoutubeContent();

  return (
    <div>
      <PageHeader
        title="Aulas do YouTube"
        description="Salve vídeos e playlists de tecnologias Python. Cole o link e o banner, título e canal são importados automaticamente."
      />
      <YoutubeView items={items} />
    </div>
  );
}
