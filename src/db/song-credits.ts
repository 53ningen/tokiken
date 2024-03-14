import prisma from '@/db/prisma'
import { unstable_cache } from 'next/cache'

export const listSongCreditsBySong = (songId: number) =>
  unstable_cache(
    async () => {
      const credits = await prisma.song_credits.findMany({
        where: {
          song_id: songId,
        },
      })
      return credits
    },
    [`song-credits-song-${songId}`],
    {
      tags: [`song-credits-song-${songId}`],
    }
  )

export const listSongCreditsByArtist = (artistId: number) =>
  unstable_cache(
    async () => {
      const credits = await prisma.song_credits.findMany({
        include: {
          songs: true,
        },
        where: {
          artist_id: artistId,
        },
        orderBy: {
          songs: {
            id: 'asc',
          },
        },
      })
      return credits
    },
    [`song-credits-artist-${artistId}`],
    {
      tags: [`song-credits-artist-${artistId}`],
    }
  )
