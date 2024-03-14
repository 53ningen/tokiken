import prisma from '@/db/prisma'
import { cache } from 'react'

export const getYouTubeVideoType = cache(async (id: number) => {
  const type = await prisma.youtube_types.findUnique({ where: { id } })
  return type
})

export const listYouTubeVideoTypes = cache(async () => {
  const types = await prisma.youtube_types.findMany({
    orderBy: { sort_priority: 'desc' },
  })
  return types
})
