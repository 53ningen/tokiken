import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import FormItem from '@/components/commons/FormItem'
import Preview from '@/components/commons/Preview'
import SectionHeading from '@/components/commons/SectionHeading'
import Title from '@/components/commons/Title'
import CostumeDetailImagesWrapper from '@/components/costumes/CostumeDetails/CostumeDetailImagesWrapper'
import CostumeMetadata from '@/components/costumes/CostumeDetails/CostumeMetadata'
import CostumeTweets from '@/components/costumes/CostumeDetails/CostumeTweets'
import CostumeYouTubeVideos from '@/components/costumes/CostumeDetails/CostumeYouTubeVideos'
import CostumeEditor from '@/components/costumes/Editor/CostumeEditor'
import { CostumeImagesEditorWrapper } from '@/components/costumes/Editor/CostumeImagesEditorServer'
import CostumeYouTubeVideoEditorWrapper from '@/components/costumes/Editor/CostumeYouTubeVideoEditorWrapper'
import { getCostume } from '@/db/costumes'
import { Metadata } from 'next'
import Link from 'next/link'
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
    const title = `${costume.name} - 編集`
    return {
      title,
      openGraph: {
        title,
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
    <Container className="max-w-screen-lg px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: '衣装データベース', href: '/costumes' }]} />
      <div>
        <Link href={`/costumes/${costume.id}`}>
          <Title title={costume.name || ''} />
        </Link>
      </div>
      <div className="grid gap-8">
        <div>
          <SectionHeading title="📝 基本情報" />
          <CostumeEditor costume={costume} />
          <FormItem label="お披露目"></FormItem>
          <Preview>
            <CostumeMetadata costume={costume} />
          </Preview>
        </div>
        <div>
          <SectionHeading title="📷 写真" />
          <CostumeImagesEditorWrapper costume={costume} />
          <Preview>
            <div className="w-1/2">
              <CostumeDetailImagesWrapper costume={costume} />
            </div>
          </Preview>
        </div>
        <div>
          <SectionHeading title="📱 関連ツイート" />
          <Preview>
            <div className="w-1/2">
              <CostumeTweets costumeId={costume.id} />
            </div>
          </Preview>
        </div>
        <div>
          <SectionHeading title="📱 関連 YouTube 動画" />
          <CostumeYouTubeVideoEditorWrapper costume={costume} />
          <Preview>
            <CostumeYouTubeVideos costumeId={costume.id} />
          </Preview>
        </div>
      </div>
    </Container>
  )
}

export default Costume
