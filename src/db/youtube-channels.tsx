import prisma from '@/db/prisma'
import { unstable_cache } from 'next/cache'

export const getYouTubeChannel = (id: string) =>
  unstable_cache(
    async () => {
      const channel = await prisma.youtube_channels.findUnique({ where: { id } })
      return channel
    },
    [`youtube-channel-${id}`],
    { tags: [`youtube-channel-${id}`] }
  )

export const listYouTubeChannels = unstable_cache(
  async () => {
    const channels = await prisma.youtube_channels.findMany({
      orderBy: { sync_enabled: 'desc' },
    })
    return channels
  },
  ['youtube-channels'],
  { tags: ['youtube-channels'] }
)
