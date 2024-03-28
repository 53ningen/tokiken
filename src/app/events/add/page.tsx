import Container from '@/components/commons/Container'
import SectionHeading from '@/components/commons/SectionHeading'
import Title from '@/components/commons/Title'
import EventEditor from '@/components/events/Editor/EventEditor'
import EventPlaceEditor from '@/components/events/Editor/EventPlaceEditor'
import { listEventPlaces } from '@/db/events'

const title = '超ときめき♡カレンダー'
const description = 'イベント/イベント会場データ作成ページ'

const Dashboard = async () => {
  const places = await listEventPlaces()
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Title title={title} description={description} />
      <div className="grid gap-8 text-left">
        <div>
          <SectionHeading title="イベントデータ作成" />
          <EventEditor places={places} />
        </div>
        <div>
          <SectionHeading title="イベント会場データ作成" />
          <EventPlaceEditor />
        </div>
      </div>
    </Container>
  )
}

export default Dashboard
