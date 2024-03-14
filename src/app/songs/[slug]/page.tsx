import SectionHeading from '@/components/SectionHeading'
import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import SongVideoCollection from '@/components/contents/youtube/VideoCollection/SongVideoCollection'
import RecordEditionCollection from '@/components/records/RecordEditionCollection/RecordEditionCollection'
import SongCredits from '@/components/songs/SongData/SongCredits'
import SongMetadata from '@/components/songs/SongData/SongMetadata'
import { getSongBySlug } from '@/db/songs'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata | null> => {
  const slug = decodeURIComponent(params.slug)
  const song = await getSongBySlug(slug)()
  if (!song) {
    return null
  } else {
    const title = `${song.title} - 超ときめき♡楽曲データベース`
    const description = `超ときめき♡宣伝部の楽曲: ${song.title} のデータ`
    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    }
  }
}

export const generateStaticParams = async () => {
  return []
}

const Song = async ({ params }: Props) => {
  const slug = decodeURIComponent(params.slug)
  const song = await getSongBySlug(slug)()
  if (!song) {
    notFound()
  }
  const { id, title } = song
  return (
    <Container className="max-w-screen-lg px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: '楽曲データベース', href: '/songs' }]} />
      <SongMetadata song={song} />
      <SongCredits songId={id} />
      <div className="py-4">
        <SectionHeading title="収録レコード" />
        <RecordEditionCollection songId={id} />
      </div>
      <SongVideoCollection songId={id} short={false} />
      <SongVideoCollection songId={id} short={true} />
    </Container>
  )
}

export default Song
