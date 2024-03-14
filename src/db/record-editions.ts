import prisma from '@/db/prisma'
import { unstable_cache } from 'next/cache'

export const listRecordEditions = unstable_cache(
  async () => {
    const recordEditions = await prisma.record_editions.findMany({
      include: { records: true },
      orderBy: { id: 'asc' },
    })
    return recordEditions
  },
  ['record-editions'],
  { tags: ['record-editions'] }
)

export const listRecordEditionsBySong = (songId: number) =>
  unstable_cache(
    async () => {
      const recordEditions = await prisma.record_editions.findMany({
        where: {
          record_tracks: {
            some: {
              song_id: songId,
            },
          },
        },
        include: { records: true },
        orderBy: {
          release_date: 'asc',
        },
      })
      return recordEditions
    },
    [`record-editions-song-${songId}`],
    { tags: [`record-editions-song-${songId}`] }
  )

export const listRecordEditionsByRecord = (recordId: number) =>
  unstable_cache(
    async () => {
      const recordEditions = await prisma.record_editions.findMany({
        where: { record_id: recordId },
        orderBy: { display_order: 'asc' },
      })
      return recordEditions
    },
    [`record-editions-record-${recordId}`],
    { tags: [`record-editions-record-${recordId}`] }
  )
