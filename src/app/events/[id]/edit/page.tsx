import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Preview from '@/components/commons/Preview'
import SectionHeading from '@/components/commons/SectionHeading'
import Title from '@/components/commons/Title'
import EventCastEditorWrapper from '@/components/events/Editor/EventCastEditorWrapper'
import { EventCostumeEditorWrapper } from '@/components/events/Editor/EventCostumeEditorWrapper'
import EventEditorNavigation from '@/components/events/Editor/EventEditorNavigation'
import { EventEditorWrapper } from '@/components/events/Editor/EventEditorWrapper'
import EventNoteEditor from '@/components/events/Editor/EventNoteEditor'
import EventTweetEditorWrapper from '@/components/events/Editor/EventTweetEditorWrapper'
import EventCostumeList from '@/components/events/EventCostumeList'
import EventInfo from '@/components/events/EventInfo'
import EventNote from '@/components/events/EventNote'
import EventSetList from '@/components/events/EventSetList'
import EventTweetList from '@/components/events/EventTweetList'
import { getEvent } from '@/db/events'
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
  const event = await getEvent(id)()
  if (!event) {
    return null
  } else {
    const title = `${event.title} - 編集`
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

const EventEdit = async ({ params }: Props) => {
  const id = parseInt(params.id)
  if (isNaN(id) || id < 1) {
    return notFound()
  }
  const event = await getEvent(id)()
  if (!event) {
    return notFound()
  }
  const yyyymm = `${event.date.slice(0, 4)}${event.date.slice(5, 7)}`
  return (
    <Container className="max-w-screen-lg px-2 md:px-2 py-4">
      <Breadcrumbs
        items={[{ name: '超ときめき♡カレンダー', href: `/calendar/${yyyymm}` }]}
      />
      <Link href={`/events/${event.id}`}>
        <Title title={event.title || ''} />
      </Link>
      <div className="grid gap-8">
        <EventEditorNavigation event={event} />
        <div>
          <SectionHeading title="📝 基本情報" />
          <EventEditorWrapper event={event} />
          <EventCastEditorWrapper event={event} />
          <Preview>
            <EventInfo event={event} />
          </Preview>
        </div>
        <div>
          <SectionHeading title="📝 イベントメモ" />
          <EventNoteEditor event={event} />
          <Preview>
            <EventNote event={event} />
          </Preview>
        </div>
        <div>
          <SectionHeading title="👗 衣装" />
          <EventCostumeEditorWrapper event={event} />
          <Preview>
            <EventCostumeList event={event} />
          </Preview>
        </div>
        <div>
          <SectionHeading title="📝 関連ツイート" />
          <EventTweetEditorWrapper event={event} />
          <Preview>
            <EventTweetList event={event} />
          </Preview>
        </div>
        <div>
          <SectionHeading title="🎵 セットリスト" />
          <Preview>
            <EventSetList event={event} />
          </Preview>
        </div>
        <div>
          <SectionHeading title="📝 関連 YouTube 動画" />
          <Preview></Preview>
        </div>
        <div>
          <SectionHeading title="📝 関連記事・URL" />
          <Preview></Preview>
        </div>
        <div>
          <SectionHeading title="📝 関連ブログ" />
          <Preview></Preview>
        </div>
        <div>
          <SectionHeading title="📝 その他" />
          <Preview></Preview>
        </div>
        <div>
          <SectionHeading title="📝 写真" />
          <Preview></Preview>
        </div>
      </div>
    </Container>
  )
}

export default EventEdit
