'use client'

import Alert from '@/components/commons/Alert'
import Tweet from '@/components/contents/tweets/Tweet'
import { Event, EventTweet } from '@/db/events'
import { TweetAuthor, Tweet as TweetType } from '@/db/tweets'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { addEventTweetByIds } from './EventTweetEditorWrapper'

interface Props {
  event: Event
  tweet: TweetType & { tweet_authors: TweetAuthor }
  eventTweetIds: string[]
}

const EventTweetSelectorItem = ({ event, tweet, eventTweetIds }: Props) => {
  const [result, setResult] = useState<Either<string, EventTweet>>()
  const associated = eventTweetIds.includes(tweet.id)
  return (
    <div key={tweet.id} className="flex flex-col gap-2">
      <button
        onClick={async () => {
          setResult(await addEventTweetByIds(event.id, tweet.id))
        }}
        disabled={associated}
        className={`${
          associated ? 'bg-gray-500' : 'bg-blue-500'
        } text-white py-1 px-2 w-full rounded`}>
        ▼ {associated ? '追加済み' : '追加'}
      </button>
      {result?.isLeft && <Alert type="error" message={result.value} />}
      <Tweet status={tweet} />
    </div>
  )
}

export default EventTweetSelectorItem
