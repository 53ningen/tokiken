import Alert from '@/components/commons/Alert'
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
import ArtistEditor from '@/components/dashboard/artists/ArtistEditor'
import { EventEditorWrapper } from '@/components/events/Editor/EventEditorWrapper'
import EventPlaceEditor from '@/components/events/Editor/EventPlaceEditor'
import { AuthGetCurrentUserServer, groupsServer } from '@/utils/amplify'

const title = '超ときめき♡研究部室'
const description = '超ときめき♡研究部 管理者用ページ'

const Dashboard = async () => {
  const [user, groups] = await Promise.all([AuthGetCurrentUserServer(), groupsServer()])

  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Title title={title} description={description} />
      <div className="flex flex-col gap-8 text-left [&_a]:text-primary">
        <div>
          <FormItem label="ユーザーID">{user?.userId}</FormItem>
          <FormItem label="所属グループ">{groups.join(', ')}</FormItem>
        </div>
        <div className="flex flex-col">
          <SectionHeading title="🏟️ イベントデータ管理" />
          <Alert
            type="info"
            message="「作成済みイベント編集ページ」へは各イベントページの編集ボタンから遷移可能"
          />
          <div className="grid gap-8 text-left">
            <FormItem label="イベント追加">
              <EventEditorWrapper />
            </FormItem>
            <FormItem label="会場追加">
              <EventPlaceEditor />
            </FormItem>
          </div>
        </div>
        <div className="flex flex-col">
          <SectionHeading title="🎬 YouTube データ管理" />
          <div className="grid gap-8 text-left">
            <FormItem label="動画追加">
              <PutVideoForm />
            </FormItem>
            <FormItem label="チャンネル同期">
              <SyncYouTubeChannelsForm />
              <Preview>
                <ChannelCollection />
              </Preview>
            </FormItem>
          </div>
        </div>
        <div className="flex flex-col">
          <SectionHeading title="📄 コンテンツデータ管理" />
          <div className="grid gap-8 text-left">
            <FormItem label="ブログ同期"></FormItem>
            <FormItem label="記事追加"></FormItem>
            <FormItem label="記事同期"></FormItem>
            <FormItem label="ツイート同期"></FormItem>
          </div>
        </div>
        <div className="flex flex-col">
          <SectionHeading title="🎼 楽曲データ追加 [Admin Only]" />
          <div className="grid gap-8 text-left">
            <FormItem label="アーティスト">
              <ArtistEditor />
            </FormItem>
            <FormItem label="楽曲"></FormItem>
            <FormItem label="レコード"></FormItem>
          </div>
        </div>
        <div className="flex flex-col">
          <SectionHeading title="👗 衣装データ追加 [Admin Only]" />
          <div className="grid gap-8 text-left">
            <FormItem label="追加"></FormItem>
          </div>
        </div>
        <div className="flex flex-col">
          <SectionHeading title="📙 記事追加 [Admin Only]" />
          <div className="grid gap-8 text-left">
            <FormItem label="追加"></FormItem>
          </div>
        </div>
        <div>
          <SectionHeading title="🧰 キャッシュ制御 [Admin Only]" />
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
