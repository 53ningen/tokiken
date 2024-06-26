import prisma from '@/db/prisma'
import { tweet_authors, tweets } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Tweet = tweets
export type TweetAuthor = tweet_authors

export const getTweet = (id: string) =>
  unstable_cache(
    async () => {
      const tweet = await prisma.tweets.findUnique({
        include: {
          tweet_authors: true,
        },
        where: {
          id,
        },
      })
      return tweet
    },
    [`tweets-${id}`],
    { tags: [`tweets-${id}`] }
  )

export const tweetsByCostumeIdTag = (costumeId: number) => `tweets-costume-${costumeId}`
export const listTweetsByCostumeId = (costumeId: number) =>
  unstable_cache(
    async () => {
      const tweets = await prisma.tweets.findMany({
        include: {
          tweet_authors: true,
        },
        where: {
          costume_tweets: {
            some: {
              costume_id: costumeId,
            },
          },
        },
        orderBy: {
          published_at: 'desc',
        },
      })
      return tweets
    },
    [tweetsByCostumeIdTag(costumeId)],
    { tags: [tweetsByCostumeIdTag(costumeId)] }
  )

export const tweetsByDateTag = (date: string) => `tweets-date-${date}`
export const listTweetsByDate = (date: string) =>
  unstable_cache(
    async () => {
      const tweets = await prisma.tweets.findMany({
        include: {
          tweet_authors: true,
        },
        where: {
          published_at: {
            startsWith: date,
          },
        },
        orderBy: {
          published_at: 'asc',
        },
      })
      return tweets
    },
    [tweetsByDateTag(date)],
    { tags: [tweetsByDateTag(date)] }
  )
