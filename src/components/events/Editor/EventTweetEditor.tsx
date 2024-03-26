'use client'

import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import SubmitButton from '@/components/commons/SubmitButton'
import { Event, EventTweet } from '@/db/events'
import { Tweet, TweetAuthor } from '@/db/tweets'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { addEventTweet } from './EventTweetEditorWrapper'
import EventTweetItemEditor from './EventTweetItemEditor'
import EventTweetSelector from './EventTweetSelector'

interface Props {
  event: Event
  eventTweets: (EventTweet & { tweets: Tweet & { tweet_authors: TweetAuthor } })[]
}

const EventTweetEditor = ({ event, eventTweets }: Props) => {
  const [result, setResult] = useState<Either<string, EventTweet>>()
  const { id: event_id } = event
  return (
    <div className="grid gap-4">
      <EventTweetSelector event={event} eventTweets={eventTweets} />
      <form
        action={async (data) => {
          setResult(await addEventTweet(data))
        }}>
        <input type="hidden" name="event_id" value={event_id} />
        <FormItem id="tweet" label="追加">
          <input
            id="tweet"
            name="tweet"
            required
            type="text"
            autoComplete="off"
            className="border rounded grow py-1 px-3 mr-2"
          />
          <SubmitButton>追加</SubmitButton>
        </FormItem>
      </form>
      <FormItem label="削除">
        <div className="grid gap-2 w-full">
          {eventTweets.length === 0 && (
            <div className="text-sm text-gray-500">紐づいているツイートがありません</div>
          )}
          {eventTweets.map((et) => (
            <EventTweetItemEditor key={et.id} eventTweet={et} />
          ))}
        </div>
      </FormItem>
      {result?.isLeft && <Alert type="error" message={result.value} className="my-4" />}
    </div>
  )
}

export default EventTweetEditor
