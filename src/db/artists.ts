import prisma from '@/db/prisma'
import { artists } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type Artist = artists

export const getArtist = (id: number) =>
  unstable_cache(
    async () => {
      const artist = await prisma.artists.findUnique({
        include: {
          costumes: {
            include: {
              costume_images: {
                take: 1,
              },
            },
          },
        },
        where: { id },
      })
      return artist
    },
    [`artists-${id}`],
    { tags: [`artists-${id}`] }
  )

export const listArtists = unstable_cache(
  async () => {
    const artists = await prisma.artists.findMany({ orderBy: { kana: 'asc' } })
    return artists
  },
  ['artists'],
  { tags: ['artists'] }
)
