import prisma from '@/db/prisma'
import { song_credits, song_credits_role, songs } from '@prisma/client'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

export type Song = songs
export type SongCredit = song_credits
export type SongCreditRole = song_credits_role

export const getSong = cache(async (id: number) => {
  const song = await prisma.songs.findUnique({ where: { id } })
  return song
})

export const getSongBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const song = await prisma.songs.findFirst({ where: { slug } })
      return song
    },
    [`songs-${encodeURIComponent(slug)}`],
    { tags: [`songs-${encodeURIComponent(slug)}`] }
  )

export const listSongs = unstable_cache(
  async () => {
    const songs = await prisma.songs.findMany({
      include: {
        song_credits: true,
      },
      orderBy: {
        kana: 'asc',
      },
    })
    return songs
  },
  [`songs`],
  { tags: ['songs'] }
)
