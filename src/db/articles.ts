import prisma from '@/db/prisma'
import { articles } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Article = articles

export const articlesByWordTag = (word: string) => `articles-word-${word}`
export const searchArticlesByWord = (word: string) =>
  unstable_cache(
    async () => {
      const articles = await prisma.articles.findMany({
        where: {
          title: {
            contains: word,
          },
        },
        orderBy: { published_at: 'asc' },
      })
      return articles
    },
    [articlesByWordTag(word)],
    { tags: [articlesByWordTag(word)], revalidate: 60 * 60 }
  )

export const articlesByDateTag = (date: string) => `articles-date-${date.slice(0, 7)}`
export const searchArticlesByDate = (date: string) =>
  unstable_cache(
    async () => {
      const prev = new Date(date)
      prev.setMonth(prev.getMonth() - 1)
      const next = new Date(date)
      next.setMonth(next.getMonth() + 1)
      const articles = await prisma.articles.findMany({
        where: {
          OR: [
            { published_at: { startsWith: prev.toISOString().slice(0, 7) } },
            { published_at: { startsWith: date.slice(0, 7) } },
            { published_at: { startsWith: next.toISOString().slice(0, 7) } },
          ],
        },
        orderBy: { published_at: 'asc' },
      })
      return articles
    },
    [articlesByDateTag(date)],
    { tags: [articlesByDateTag(date)], revalidate: 60 * 60 }
  )
