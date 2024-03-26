'use server'

import prisma from '@/db/prisma'
import { YouTubeVideoWithChannel } from '@/db/youtube-vidoes'
import { isAssociateUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { google } from 'googleapis'
import { revalidateTag } from 'next/cache'
import { getVideoTypeId, isShortVideo } from './VideoTypes'

const youtube = google.youtube('v3')
const { GOOGLE_API_KEY } = process.env

export const putVideoFromForm = async (
  data: FormData
): Promise<Either<any, YouTubeVideoWithChannel>> => {
  const url = new URL(data.get('url') as string)
  if (!url || !url.hostname.endsWith('youtube.com') || !url.searchParams.get('v')) {
    return left('Invalid URL')
  } else {
    const id = url.searchParams.get('v')!
    const res = await putVideo(id)
    return res
  }
}

export const putVideo = async (
  videoId: string
): Promise<Either<any, YouTubeVideoWithChannel>> => {
  if (!(await isAssociateUserServer())) {
    return left('Unauthorized')
  }
  try {
    const videos = await youtube.videos.list({
      id: [videoId],
      part: ['id', 'snippet'],
      key: GOOGLE_API_KEY,
      hl: 'ja',
    })
    const videoItems = videos.data.items
    if (!videoItems || videoItems.length !== 1) {
      return left(`Video Not Found: ${videoId}`)
    }
    const video = videoItems[0]

    const channels = await youtube.channels.list({
      id: [video.snippet?.channelId!],
      key: GOOGLE_API_KEY,
      part: ['id', 'snippet'],
      hl: 'ja',
    })
    const channel = channels.data.items![0]

    const title = video.snippet!.localized?.title || video.snippet!.title!
    const is_short = await isShortVideo(video.id!)
    const type_id = getVideoTypeId(
      is_short,
      video.snippet!.channelId!,
      video.snippet!.title!
    )

    const ch = await prisma.youtube_channels.upsert({
      where: {
        id: channel.id!,
      },
      update: {},
      create: {
        id: channel.id!,
        title: channel.snippet!.title!,
        thumbnail_url: channel.snippet!.thumbnails!.medium!.url!,
        sync_enabled: false,
      },
    })
    const v = await prisma.youtube_videos.upsert({
      where: {
        id: video.id!,
      },
      update: {},
      create: {
        id: video.id!,
        published_at: video.snippet!.publishedAt!.replace('T', ' ').replace('Z', ''),
        channel_id: video.snippet!.channelId!,
        title,
        type_id,
        is_short,
      },
    })
    const tags = [
      `youtube-channels`,
      `youtube-channel-${channel.id!}`,
      `youtube-videos-by-channel-${channel.id!}`,
      `youtube-videos-by-type-${type_id}`,
    ]
    for (const tag of tags) {
      revalidateTag(tag)
      console.log(`RevalidateTag: ${tag}`)
    }
    const res = { ...v, youtube_channels: ch } as YouTubeVideoWithChannel
    return right(res)
  } catch (error: any) {
    return left(error)
  }
}
