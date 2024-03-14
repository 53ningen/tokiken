import IndexedArtistCollection from '@/components/artists/ArtistCollection/IndexedArtistCollection'
import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import IndexNav, { jpIndexNavItems } from '@/components/commons/Index/IndexNav'
import Title from '@/components/commons/Title'
import { Metadata } from 'next'

const title = '超ときめき♡アーティストデータベース'
const description = '超ときめき♡宣伝部のアーティストのデータ'

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

const Artists = () => {
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: 'アーティストデータベース', href: '/artists' }]} />
      <Title
        title="超ときめき♡アーティストデータベース"
        description="超ときめき♡宣伝部のアーティストのデータ"
      />
      <div className="pb-4">
        <IndexNav items={jpIndexNavItems} />
      </div>
      <IndexedArtistCollection />
    </Container>
  )
}

export default Artists
