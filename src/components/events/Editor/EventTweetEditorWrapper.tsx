'use server'

import { Event, EventTweet, eventTweetsTag, listEventTweets } from '@/db/events'
import prisma from '@/db/prisma'
import { Tweet, TweetAuthor, listTweetsByDate } from '@/db/tweets'
import { isAdminUserServer, isAssociateUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { revalidateTag } from 'next/cache'
import EventTweetEditor from './EventTweetEditor'

interface Props {
  event: Event
}

const EventTweetEditorWrapper = async ({ event }: Props) => {
  const eventTweets = await listEventTweets(event.id)()
  return <EventTweetEditor event={event} eventTweets={eventTweets} />
}

export default EventTweetEditorWrapper

export const searchTweets = async (
  date: string
): Promise<Either<string, (Tweet & { tweet_authors: TweetAuthor })[]>> => {
  if (!(await isAssociateUserServer())) {
    return left('Unauthorized')
  }
  try {
    const tweets = await listTweetsByDate(date)()
    return right(tweets)
  } catch (e) {
    console.error(e)
    return left('Internal Server Error')
  }
}

export const addEventTweet = async (
  data: FormData
): Promise<Either<string, EventTweet>> => {
  if (!(await isAssociateUserServer())) {
    return left('Unauthorized')
  }

  const rawTweetInput = data.get('tweet') as string
  if (!rawTweetInput) {
    return left('tweet_id or url is required')
  }
  const tweet_id = extractTweetId(rawTweetInput)
  console.log(tweet_id)
  if (!tweet_id) {
    return left('tweet_id or url is required')
  }
  const event_id = parseInt(data.get('event_id') as string)
  if (!event_id) {
    return left('event_id is required')
  }
  const res = await addEventTweetByIds(event_id, tweet_id)
  return res
}

export const addEventTweetByIds = async (
  event_id: number,
  tweet_id: string
): Promise<Either<string, EventTweet>> => {
  if (!(await isAssociateUserServer())) {
    return left('Unauthorized')
  }

  try {
    const exists = await prisma.event_tweets.findFirst({
      where: {
        event_id,
        tweet_id,
      },
    })
    if (exists) {
      return left('already exists')
    }
    const res = await prisma.event_tweets.create({
      data: {
        events: {
          connect: {
            id: event_id,
          },
        },
        tweets: {
          connect: {
            id: tweet_id,
          },
        },
      },
    })
    revalidateTag(eventTweetsTag(event_id))
    return right(res)
  } catch (e) {
    console.error(e)
    return left('failed to create EventTweet')
  }
}

const extractTweetId = (rawInput: string) => {
  const isUrl =
    rawInput.startsWith('https://twitter.com/') && rawInput.includes('/status/')
  if (isUrl) {
    const tweetId = rawInput.split('/status/')[1]
    console.log(tweetId)
    return tweetId
  } else if (/^\d+$/.test(rawInput)) {
    return rawInput
  } else {
    return undefined
  }
}

export const deleteEventTweet = async (
  eventTweetId: number
): Promise<Either<string, EventTweet>> => {
  if (!(await isAdminUserServer())) {
    return left('Administrator permission required, please contact with @kusabure.')
  }

  try {
    const res = await prisma.event_tweets.delete({
      where: {
        id: eventTweetId,
      },
    })
    revalidateTag(eventTweetsTag(res.event_id))
    return right(res)
  } catch (e) {
    console.error(e)
    return left('failed to delete EventTweet')
  }
}
