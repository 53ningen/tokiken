import prisma from '@/db/prisma'
import { unstable_cache } from 'next/cache'

export const getPost = (id: number) =>
  unstable_cache(
    async () => {
      const post = await prisma.posts.findUnique({
        include: { post_categories: true },
        where: { id },
      })
      return post
    },
    [`post-${id}`],
    { tags: ['post'] }
  )

export const listPosts = (offset: number, limit: number) =>
  unstable_cache(
    async () => {
      const posts = await prisma.posts.findMany({
        include: { post_categories: true },
        skip: offset,
        take: limit,
        orderBy: { created_at: 'desc' },
      })
      return posts
    },
    [`posts-${offset}-${limit}`],
    { tags: ['posts'] }
  )
