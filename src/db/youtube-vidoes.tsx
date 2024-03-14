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
    [`youtube-videos-by-costume-${costumeId}`],
    { tags: [`youtube-videos-by-costume-${costumeId}`] }
  )
