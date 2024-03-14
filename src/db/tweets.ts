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
    [`tweets-costume-${costumeId}`],
    { tags: [`tweets-costume-${costumeId}`] }
  )
