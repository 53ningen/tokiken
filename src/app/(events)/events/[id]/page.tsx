import SectionHeading from '@/components/SectionHeading'
import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Title from '@/components/commons/Title'
import Tweet from '@/components/contents/tweets/Tweet'
import EventCasts from '@/components/events/EventCasts'
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
      <div className="grid gap-1">
        <div className="text-xs text-gray-500">
          <span className="pr-1">日時:</span>
          <span>
            {event.date} {event.start}
          </span>
        </div>
        {event.event_places && (
          <div className="text-xs text-gray-500">
            <span className="pr-1">会場:</span>
            <Link
              href={`http://local.google.co.jp/maps?q=${event.event_places.address}`}
              target="_blank">
              {event.event_places.name}（{event.event_places.address}）
            </Link>
          </div>
        )}
        {event.event_casts.length > 0 && (
          <div className="[&_div]:inline-block pt-2 text-xs items-center text-gray-500">
            <span className="pr-2">出演:</span>
            <EventCasts date={event.date} casts={event.event_casts} />
          </div>
        )}
      </div>
      <div className="py-8">
        {event.event_cosutumes.length >= 0 && (
          <>
            <SectionHeading title="👗 衣装" />
            <ul>
              {event.event_cosutumes.map((costume) => {
                return <li key={costume.id}>{costume.costume_id}</li>
              })}
            </ul>
          </>
        )}
        <>
          <SectionHeading title="📝 関連ツイート" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {event.event_tweets.map((rel) => (
              <Tweet key={rel.tweets.id} status={rel.tweets} />
            ))}
          </div>
        </>
        {event.event_credits.length >= 0 && (
          <>
            <SectionHeading title="👥 クレジット" />
            <ul>
              {event.event_credits.map((credit) => {
                return (
                  <li key={credit.id}>
                    {credit.title} {credit.name}
                  </li>
                )
              })}
            </ul>
          </>
        )}
        {event.event_setlist.length >= 0 && (
          <>
            <SectionHeading title="🎵 セットリスト" />
            {event.event_setlist.map((set) => {
              return (
                <div key={set.id}>
                  <Link href={`/songs/${set.songs.slug}`}>{set.songs.title}</Link>
                </div>
              )
            })}
          </>
        )}
        <>
          <SectionHeading title="📝 関連 YouTube 動画" />
        </>
        <>
          <SectionHeading title="📝 関連記事・URL" />
        </>
        <>
          <SectionHeading title="📝 関連ブログ" />
        </>
        <>
          <SectionHeading title="📝 その他" />
        </>
        <>
          <SectionHeading title="📝 写真" />
        </>
      </div>
    </Container>
  )
}

export default Event
