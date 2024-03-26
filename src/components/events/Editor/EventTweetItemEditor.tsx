'use client'

import Alert from '@/components/commons/Alert'
import { EventTweet } from '@/db/events'
import { Tweet, TweetAuthor } from '@/db/tweets'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { deleteEventTweet } from './EventTweetEditorWrapper'

interface Props {
  eventTweet: EventTweet & { tweets: Tweet & { tweet_authors: TweetAuthor } }
}

const EventTweetItemEditor = ({ eventTweet }: Props) => {
  const [result, setResult] = useState<Either<string, EventTweet>>()
  return (
    <div>
      <div className="grid">
        <div className="grid mr-2 shrink text-xs text-wrap">
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/${eventTweet.tweets.screen_name}/status/${eventTweet.tweets.id}`}
              target="_blank"
              className="text-blue-500">
              id: {eventTweet.tweets.id}
            </a>
            <span className="text-gray-500">{eventTweet.tweets.published_at}</span>
            <button
              onClick={async () => {
                setResult(await deleteEventTweet(eventTweet.id))
              }}
              className="px-2 bg-red-500 text-white rounded">
              削除
            </button>
          </div>
          <span>{eventTweet.tweets.text}</span>
        </div>
      </div>
      {result?.isLeft && <Alert type="error" message={result.value} className="my-4" />}
    </div>
  )
}

export default EventTweetItemEditor
