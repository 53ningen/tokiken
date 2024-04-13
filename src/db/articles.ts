import prisma from '@/db/prisma'
import { articles } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Article = articles

export const articlesTag = 'articles'

export const articlesDateTag = (year: number, month: number) =>
  `articles-${year}-${month}`
export const listArticles = (year: number, month: number) =>
  unstable_cache(
    async () => {
      const articles = await prisma.articles.findMany({
        where: {
          published_at: {
            startsWith: `${year}-${month.toString().padStart(2, '0')}`,
          },
        },
        orderBy: {
          published_at: 'asc',
        },
      })
      return articles
    },
    [articlesDateTag(year, month)],
    { tags: [articlesDateTag(year, month)] }
  )

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
    { tags: [articlesByWordTag(word), articlesTag], revalidate: 60 * 60 }
  )
