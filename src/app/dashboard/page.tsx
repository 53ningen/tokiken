import Container from '@/components/commons/Container'
import FormItem from '@/components/commons/FormItem'
import LogoutButton from '@/components/commons/LogoutButton'
import Preview from '@/components/commons/Preview'
import SectionHeading from '@/components/commons/SectionHeading'
import Title from '@/components/commons/Title'
import ChannelCollection from '@/components/contents/youtube/ChannelCollection/ChannelCollection'
import PutVideoForm from '@/components/contents/youtube/Editor/PutVideoForm'
import SyncYouTubeChannelsForm from '@/components/contents/youtube/Editor/SyncYouTubeChannelsForm'
import RevalidateTagForm from '@/components/dashboard/RevalidateTagForm'
import { EventEditorWrapper } from '@/components/events/Editor/EventEditorWrapper'
import EventPlaceEditor from '@/components/events/Editor/EventPlaceEditor'

const title = '超ときめき♡研究部室'
const description = '超ときめき♡研究部 管理者用ページ'

const Dashboard = async () => {
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Title title={title} description={description} />
      <div className="flex flex-col gap-8 text-left [&_a]:text-primary">
        <div className="flex flex-col">
          <SectionHeading title="🏟️ イベントデータ追加" />
          <div className="grid gap-8 text-left">
            <div>
              <FormItem label="イベント追加">
                <EventEditorWrapper />
              </FormItem>
            </div>
            <div>
              <FormItem label="会場追加">
                <EventPlaceEditor />
              </FormItem>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <SectionHeading title="🎬 YouTube データ管理" />
          <div className="grid gap-8 text-left">
            <div>
              <FormItem label="動画追加">
                <PutVideoForm />
              </FormItem>
            </div>
            <div>
              <FormItem label="チャンネル同期">
                <SyncYouTubeChannelsForm />
                <Preview>
                  <ChannelCollection />
                </Preview>
              </FormItem>
            </div>
          </div>
        </div>
        <div>
          <SectionHeading title="🧰 キャッシュ制御" />
          <RevalidateTagForm />
        </div>
        <div className="text-right">
          <LogoutButton />
        </div>
      </div>
    </Container>
  )
}

export default Dashboard
