import prisma from '@/db/prisma'
import { youtube_channels, youtube_types, youtube_videos } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export type YouTubeVideo = youtube_videos
export type YouTubeVideoType = youtube_types
export type YouTubeChannel = youtube_channels
export type YouTubeVideoWithChannel = youtube_videos & {
  youtube_channels: youtube_channels
}

export const listYouTubeVideosByChannel = (
  channelId: string,
  offset: number,
  limit: number
) =>
  unstable_cache(
    async () => {
      const videos = await prisma.youtube_videos.findMany({
        select: {
          id: true,
          title: true,
          channel_id: true,
          published_at: true,
          type_id: true,
          is_short: true,
          youtube_channels: true,
        },
        where: {
          channel_id: channelId,
        },
        orderBy: { published_at: 'desc' },
        skip: offset,
        take: limit,
      })
      return videos
    },
    [`youtube-videos-by-channel-${channelId}-${offset}-${limit}`],
    {
      tags: [`youtube-videos-by-channel-${channelId}`],
    }
  )

export const listYouTubeVideosByVideoType = (
  videoTypeId: number,
  offset: number,
  limit: number
) =>
  unstable_cache(
    async () => {
      const videos = await prisma.youtube_videos.findMany({
        select: {
          id: true,
          title: true,
          channel_id: true,
          published_at: true,
          type_id: true,
          is_short: true,
          youtube_channels: true,
        },
        where: {
          type_id: videoTypeId,
        },
        orderBy: { published_at: 'desc' },
        skip: offset,
        take: limit,
      })
      return videos
    },
    [`youtube-videos-by-type-${videoTypeId}-${offset}-${limit}`],
    {
      tags: [`youtube-videos-by-type-${videoTypeId}`],
    }
  )

export const listYouTubeVidoesBySong = (
  songId: number,
  short: boolean,
  offset?: number,
  limit?: number
) =>
  unstable_cache(
    async () => {
      const videos = await prisma.youtube_videos.findMany({
        select: {
          id: true,
          title: true,
          channel_id: true,
          published_at: true,
          type_id: true,
          is_short: true,
          youtube_channels: true,
        },
        where: {
          youtube_video_songs: {
            some: {
              song_id: songId,
            },
          },
          is_short: short,
        },
        orderBy: {
          published_at: 'desc',
        },
        skip: offset,
        take: limit,
      })
      return videos
    },
    [`youtube-videos-by-song-${songId}-${short}-${offset}-${limit}`],
    { tags: [`youtube-videos-by-song-${songId}`] }
  )

export const youtubeVideosByCostumeTag = (costumeId: number) =>
  `youtube-videos-by-costume-${costumeId}`
export const listYouTubeVideosByCostume = (costumeId: number) =>
  unstable_cache(
    async () => {
      const videos = await prisma.youtube_videos.findMany({
        include: {
          youtube_channels: true,
        },
        where: {
          youtube_video_costumes: {
            some: {
              costume_id: costumeId,
            },
          },
        },
        orderBy: {
          published_at: 'asc',
        },
      })
      return videos
    },
    [youtubeVideosByCostumeTag(costumeId)],
    { tags: [youtubeVideosByCostumeTag(costumeId)] }
  )

export const youTubeVideosByWordTag = (word: string) => `youtube-videos-word-${word}`
export const searchYouTubeVideosByWord = (word: string) =>
  unstable_cache(
    async () => {
      const videos = await prisma.youtube_videos.findMany({
        where: {
          title: {
            contains: word,
          },
        },
        orderBy: {
          published_at: 'asc',
        },
      })
      return videos
    },
    [youTubeVideosByWordTag(word)],
    { tags: [youTubeVideosByWordTag(word)] }
  )

export const youtubeVideosByDateTag = (date: string) =>
  `youtube-videos-date-${date.slice(0, 7)}`
export const searchYouTubeVideosByDate = (date: string) =>
  unstable_cache(
    async () => {
      const prev = new Date(date)
      prev.setMonth(prev.getMonth() - 1)
      const next = new Date(date)
      next.setMonth(next.getMonth() + 1)
      const videos = await prisma.youtube_videos.findMany({
        where: {
          OR: [
            { published_at: { startsWith: prev.toISOString().slice(0, 7) } },
            { published_at: { startsWith: date.slice(0, 7) } },
            { published_at: { startsWith: next.toISOString().slice(0, 7) } },
          ],
        },
        orderBy: { published_at: 'asc' },
      })
      return videos
    },
    [youtubeVideosByDateTag(date)],
    { tags: [youtubeVideosByDateTag(date)] }
  )
