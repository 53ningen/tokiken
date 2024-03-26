import { Event, listEventTweets } from '@/db/events'
import SectionHeading from '../commons/SectionHeading'
import Tweet from '../contents/tweets/Tweet'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventTweetList = async ({ event, showHeading = false }: Props) => {
  const tweets = await listEventTweets(event.id)()
  return (
    <>
      {tweets.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="📝 関連ツイート" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {tweets.map((rel) => (
              <Tweet key={rel.tweets.id} status={rel.tweets} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default EventTweetList
