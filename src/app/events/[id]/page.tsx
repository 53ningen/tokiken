import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Title from '@/components/commons/Title'
import EventBlogList from '@/components/events/EventBlogList'
import EventCostumeList from '@/components/events/EventCostumeList'
import EventInfo from '@/components/events/EventInfo'
import EventNote from '@/components/events/EventNote'
import EventPhotoList from '@/components/events/EventPhotoList'
import EventSetList from '@/components/events/EventSetList'
import EventTweetList from '@/components/events/EventTweetList'
import EventYouTubeVideoList from '@/components/events/EventYouTubeVideoList'
import { getEvent } from '@/db/events'
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
  const event = await getEvent(id)()
  if (!event) {
    return null
  } else {
    const title = `${event.title} - 超ときめき♡イベントデータベース`
    const description = `超ときめき♡宣伝部のイベント: ${event.title} のデータ`
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

const Event = async ({ params }: Props) => {
  const id = parseInt(params.id)
  if (isNaN(id) || id < 1) {
    notFound()
  }
  const event = await getEvent(id)()
  if (!event) {
    notFound()
  }
  const yyyymm = `${event.date.slice(0, 4)}${event.date.slice(5, 7)}`
  return (
    <Container className="max-w-screen-lg px-2 md:px-2 py-4">
      <Breadcrumbs
        items={[{ name: '超ときめき♡カレンダー', href: `/calendar/${yyyymm}` }]}
      />
      <Title title={event.title || ''} />
      <EventInfo event={event} />
      <EventNote event={event} />
      <div className="grid gap-8 py-8">
        <EventCostumeList event={event} showHeading={true} />
        <EventTweetList event={event} showHeading={true} />
        <EventSetList event={event} showHeading={true} />
        <EventYouTubeVideoList event={event} showHeading={true} />
        <EventBlogList event={event} showHeading={true} />
        <EventPhotoList event={event} showHeading={true} />
      </div>
    </Container>
  )
}

export default Event
