import prisma from '@/db/prisma'
import { unstable_cache } from 'next/cache'

export const listRecordTracksByEdition = (editionId: number) =>
  unstable_cache(
    async () => {
      const recordTracks = await prisma.record_tracks.findMany({
        where: { edition_id: editionId },
        include: {
          songs: {
            include: { song_credits: true },
          },
        },
        orderBy: [{ track: 'asc' }],
      })
      return recordTracks
    },
    [`record-tracks-edition-${editionId}`],
    { tags: [`record-tracks-edition-${editionId}`] }
  )
