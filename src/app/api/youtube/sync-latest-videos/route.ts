import prisma from '@/db/prisma'
import { YouTubeVideo } from '@/db/youtube-vidoes'
import { google } from 'googleapis'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import {
  getVideoTypeId,
  isShortVideo,
} from '../../../../components/contents/youtube/Editor/VideoTypes'

const maxResults = 50
const syncRangeMs = 1 * 24 * 60 * 60 * 1000

const youtube = google.youtube('v3')

export const dynamic = 'force-dynamic'

const { API_KEY, GOOGLE_API_KEY } = process.env

export const POST = async (request: Request) => {
  try {
    const ACTION_KEY = request.headers.get('authorization')
    if (API_KEY === ACTION_KEY) {
      const updatedVideos = await syncLatestVideos()
      for (const video of updatedVideos) {
        const tags = [
          `youtube-videos-by-channel-${video.channel_id}`,
          `youtube-videos-by-type-${video.type_id}`,
        ]
        for (const tag of tags) {
          revalidateTag(tag)
          console.log(`RevalidateTag: ${tag}`)
        }
      }
      return NextResponse.json({
        message: 'Success',
        updated_videos: updatedVideos,
      })
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}

const syncLatestVideos = async () => {
  const updatedVideos: YouTubeVideo[] = []
  const channles = await prisma?.youtube_channels.findMany({
    where: {
      sync_enabled: true,
    },
  })
  for (const channel of channles) {
    const videosIds = await searchLatestChannnelVideoIds(channel.id)
    const videos = await fetchVideoSnippet(videosIds)
    for (const video of videos || []) {
      const is_short = await isShortVideo(video.id!)
      const type_id = getVideoTypeId(
        is_short,
        video.snippet!.channelId!,
        video.snippet!.title!
      )
      const title = video.snippet!.localized?.title || video.snippet!.title!
      const record: YouTubeVideo = {
        id: video.id!,
        published_at: video.snippet!.publishedAt!.replace('T', ' ').replace('Z', ''),
        channel_id: video.snippet!.channelId!,
        title,
        type_id,
        is_short,
      }
      const res = await prisma.youtube_videos.upsert({
        where: {
          id: video.id!,
        },
        update: {},
        create: record,
      })
      console.log(res)
      updatedVideos.push(record)
    }
  }
  return updatedVideos
}

const searchLatestChannnelVideoIds = async (channelId: string) => {
  const now = new Date()
  const publishedAfter = new Date(now.getTime() - syncRangeMs).toISOString()
  const publishedBefore = now.toISOString()
  const res = await youtube.search.list({
    part: ['id'],
    channelId,
    maxResults,
    publishedAfter,
    publishedBefore,
    key: GOOGLE_API_KEY,
  })

  return (
    (res.data.items
      ?.map((i) => i.id?.videoId)
      .filter((i) => i !== undefined) as string[]) || []
  )
}

const fetchVideoSnippet = async (videoIds: string[]) => {
  if (videoIds.length > 0) {
    const res = await youtube.videos.list({
      id: videoIds,
      part: ['id', 'snippet'],
      key: GOOGLE_API_KEY,
      hl: 'ja',
    })
    return res.data.items
  } else {
    return []
  }
}
