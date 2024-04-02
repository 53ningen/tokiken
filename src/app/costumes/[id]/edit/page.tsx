import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import CostumeDetailImages from '@/components/costumes/CostumeDetails/CostumeDetailImages'
import CostumeInfo from '@/components/costumes/CostumeDetails/CostumeInfo'
import CostumeMetadata from '@/components/costumes/CostumeDetails/CostumeMetadata'
import CostumeTweets from '@/components/costumes/CostumeDetails/CostumeTweets'
import CostumeYouTubeVideos from '@/components/costumes/CostumeDetails/CostumeYouTubeVideos'
import { getCostume } from '@/db/costumes'
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
  const costume = await getCostume(id)()
  if (!costume) {
    return null
  } else {
    const title = `${costume.name} - 超ときめき♡衣装データベース`
    const description = `超ときめき♡宣伝部の衣装: ${costume.name} のデータ`
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

const Costume = async ({ params }: Props) => {
  const id = parseInt(params.id)
  if (isNaN(id) || id < 1) {
    notFound()
  }
  const costume = await getCostume(id)()
  if (!costume) {
    notFound()
  }
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs
        items={[
          { name: '衣装データベース', href: '/costumes' },
          { name: costume.name, href: `/costumes/${costume.id}` },
        ]}
      />
      <CostumeMetadata costume={costume} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
        <div className="flex-none">
          <CostumeDetailImages images={costume.costume_images} />
        </div>
        <div>
          <CostumeTweets costumeId={costume.id} />
        </div>
      </div>
      <CostumeInfo costumeId={costume.id} />
      <CostumeYouTubeVideos costumeId={costume.id} />
    </Container>
  )
}

export default Costume
