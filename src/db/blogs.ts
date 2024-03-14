import prisma from '@/db/prisma'
import { blogs } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Blog = blogs

export const listBlogs = (year: number, month: number) =>
  unstable_cache(
    async () => {
      const blogs = await prisma.blogs.findMany({
        where: {
          published_at: {
            startsWith: `${year}-${month.toString().padStart(2, '0')}`,
          },
        },
        orderBy: {
          published_at: 'asc',
        },
      })
      return blogs
    },
    [`blogs-${year}-${month}`],
    {
      tags: [`blogs-${year}-${month}`],
    }
  )
