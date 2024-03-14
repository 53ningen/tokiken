import ArtistDetails from '@/components/artists/ArtistDetails/ArtistDetails'
import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import { getArtist } from '@/db/artists'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata | null> => {
  const id = parseInt(params.id)
  if (isNaN(id) || id < 1) {
    return null
  }
  const artist = await getArtist(id)()
  if (!artist) {
    return null
  } else {
    const title = `${artist.name} - 超ときめき♡アーティストデータベース`
    const description = `超ときめき♡宣伝部のアーティスト: ${artist.name} のデータ`
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

const Artist = async ({ params }: Props) => {
  const id = parseInt(params.id)
  if (isNaN(id) || id < 1) {
    notFound()
  }
  const artist = await getArtist(id)()
  if (!artist) {
    notFound()
  }
  return (
    <Container className="max-w-screen-lg  px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: 'アーティストデータベース', href: '/artists' }]} />
      <ArtistDetails artist={artist} />
    </Container>
  )
}

export default Artist
