'use server'

import { Costume } from '@/db/costumes'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import {
  Tweet,
  TweetAuthor,
  listTweetsByCostumeId,
  listTweetsByDate,
  tweetsByCostumeIdTag,
} from '@/db/tweets'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import CostumeTweetEditor from './CostumeTweetEditor'

interface Props {
  costume: Costume
}

const CostumeTweetEditorServer = async ({ costume }: Props) => {
  const tweets = await listTweetsByCostumeId(costume.id)()
  return <CostumeTweetEditor costume={costume} tweets={tweets} />
}

export default CostumeTweetEditorServer

interface State {
  error?: string
  relatedTweets: (Tweet & { tweet_authors: TweetAuthor })[]
  items?: (Tweet & { tweet_authors: TweetAuthor })[]
}

export const costumeTweetEditorAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAdminPermission.message, ...state }
  }
  const action = data.get('action') as string
  const costumeId = parseInt(data.get('costume_id') as string)
  if (!action || isNaN(costumeId)) {
    return { error: Errors.InvalidRequest.message, ...state }
  }

  if (action === 'close') {
    return { ...state, items: [] }
  }
  if (action === 'search') {
    const date = data.get('date') as string
    if (!date) {
      return { error: Errors.InvalidRequest.message, ...state }
    }
    const items = await listTweetsByDate(date)()
    return { ...state, items, error: undefined }
  }
  if (action === 'insert') {
    const tweetId = extractTweetId(data.get('tweet') as string)
    if (!tweetId) {
      return { ...state, error: Errors.InvalidRequest.message }
    }
    const relatedTweets = await insertRelation(costumeId, tweetId)
    return relatedTweets
      ? { ...state, relatedTweets, error: undefined }
      : { ...state, error: Errors.DatabaseError.message }
  }
  if (action.startsWith('insert:')) {
    const tweetId = action.split(':')[1]
    const relatedTweets = await insertRelation(costumeId, tweetId)
    return relatedTweets
      ? { ...state, relatedTweets, error: undefined }
      : { ...state, error: Errors.DatabaseError.message }
  }
  if (action.startsWith('delete:')) {
    const tweetId = action.split(':')[1]
    const relatedTweets = await deleteRelation(costumeId, tweetId)
    return relatedTweets
      ? { ...state, relatedTweets, error: undefined }
      : { ...state, error: Errors.DatabaseError.message }
  }

  return { ...state, error: Errors.InvalidRequest.message }
}

const extractTweetId = (rawInput: string) => {
  const isUrl =
    rawInput.startsWith('https://twitter.com/') && rawInput.includes('/status/')
  if (isUrl) {
    const tweetId = rawInput.split('/status/')[1]
    return tweetId
  } else if (/^\d+$/.test(rawInput)) {
    return rawInput
  } else {
    return undefined
  }
}

const insertRelation = async (costume_id: number, tweet_id: string) => {
  try {
    const params = {
      data: {
        costume_id,
        tweet_id,
      },
    }
    await executeQueryWithLogging(
      prisma.costume_tweets.create(params),
      'costume_tweets.create',
      params
    )
    revalidateTag(tweetsByCostumeIdTag(costume_id))
    const relatedTweets = await listTweetsByCostumeId(costume_id)()
    return relatedTweets
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const deleteRelation = async (costume_id: number, tweet_id: string) => {
  try {
    const params = {
      where: {
        costume_id,
        tweet_id,
      },
    }
    await executeQueryWithLogging(
      prisma.costume_tweets.deleteMany({
        where: {
          costume_id,
          tweet_id,
        },
      }),
      'costume_tweets.deleteMany',
      params
    )
    revalidateTag(tweetsByCostumeIdTag(costume_id))
    const relatedTweets = await listTweetsByCostumeId(costume_id)()
    return relatedTweets
  } catch (e) {
    console.error(e)
    return undefined
  }
}
