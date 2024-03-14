import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import IndexNav, { jpIndexNavItems } from '@/components/commons/Index/IndexNav'
import Title from '@/components/commons/Title'
import IndexedSongCollection from '@/components/songs/SongCollection/IndexedSongCollection'
import { Metadata } from 'next'

const title = '超ときめき♡楽曲データベース'
const description = '超ときめき♡宣伝部の楽曲のデータ'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

const Songs = () => {
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: '楽曲データベース', href: '/songs' }]} />
      <Title title={title} description={description} />
      <IndexNav items={jpIndexNavItems} />
      <IndexedSongCollection />
    </Container>
  )
}

export default Songs
