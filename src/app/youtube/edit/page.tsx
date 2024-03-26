import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import SectionHeading from '@/components/commons/SectionHeading'
import Title from '@/components/commons/Title'
import ChannelCollection from '@/components/contents/youtube/ChannelCollection/ChannelCollection'
import PutVideoForm from '@/components/contents/youtube/Editor/PutVideoForm'
import SyncYouTubeChannelsForm from '@/components/contents/youtube/Editor/SyncYouTubeChannelsForm'
import { Metadata } from 'next'

interface Props {}

const title = '超ときめき♡YouTubeデータベース 管理ページ'
const description = 'YouTubeデータ管理ページ'

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

const Contents = async ({}: Props) => {
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: 'YouTube データベース', href: '/youtube' }]} />
      <Title title={title} description={description} />
      <div className="grid gap-16 text-left">
        <div>
          <SectionHeading title="ビデオデータ管理" />
          <PutVideoForm />
        </div>
        <div className="grid gap-4">
          <SectionHeading title="チャンネルデータ管理" />
          <SyncYouTubeChannelsForm />
          <ChannelCollection />
        </div>
      </div>
    </Container>
  )
}

export default Contents
