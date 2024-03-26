'use client'

import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { Event, EventTweet } from '@/db/events'
import { TweetAuthor, Tweet as TweetType } from '@/db/tweets'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { searchTweets } from './EventTweetEditorWrapper'
import EventTweetSelectorItem from './EventTweetSelectorItem'

interface Props {
  event: Event
  eventTweets: EventTweet[]
}

const EventTweetSelector = ({ event, eventTweets }: Props) => {
  const [selectedDate, setSelectedDate] = useState(event.date)
  const [result, setResult] =
    useState<Either<string, (TweetType & { tweet_authors: TweetAuthor })[]>>()
  const eventTweetIds = eventTweets.map((et) => et.tweet_id)
  return (
    <>
      <FormItem id="date" label="検索">
        <input
          id="date"
          name="date"
          value={selectedDate}
          required
          type="date"
          autoComplete="off"
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded py-1 px-3 mr-2"
        />
        <button
          onClick={async () => {
            setResult(await searchTweets(selectedDate))
          }}
          className="bg-blue-500 text-white py-1 px-2 rounded">
          検索
        </button>
        {result?.isRight && (
          <button
            onClick={() => setResult(undefined)}
            className="bg-red-500 text-white py-1 px-2 rounded ml-2">
            閉じる
          </button>
        )}
      </FormItem>
      {result?.isLeft && <Alert type="error" message={result.value} />}
      {result?.isRight && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {result.value.map((tweet) => (
            <EventTweetSelectorItem
              key={tweet.id}
              event={event}
              tweet={tweet}
              eventTweetIds={eventTweetIds}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default EventTweetSelector
