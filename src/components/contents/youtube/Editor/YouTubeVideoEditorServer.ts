'use server'

import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { YouTubeVideo } from '@/db/youtube-vidoes'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { google } from 'googleapis'
import { revalidateTag } from 'next/cache'
import { getVideoTypeId, isShortVideo } from './VideoTypes'

const youtube = google.youtube('v3')
const { GOOGLE_API_KEY } = process.env

interface State {
  error?: string
  video?: YouTubeVideo
}

export const youTubeVideoEditorAction = async (
  _: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }
  const url = new URL(data.get('url') as string)
  if (!url || !url.hostname.endsWith('youtube.com') || !url.searchParams.get('v')) {
    return { error: Errors.InvalidRequest.message }
  }

  const videoId = url.searchParams.get('v')!
  const videoInfo = await fetchVideoInfo(videoId)
  if (!videoInfo || !videoInfo.video || !videoInfo.channel) {
    return { error: Errors.YouTubeAPIError.message }
  }

  try {
    const { video, is_short, type_id, channel } = videoInfo
    const chParams = {
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
    }
    const ch = await executeQueryWithLogging(
      prisma.youtube_channels.upsert(chParams),
      'youtube_channels.upsert',
      chParams
    )
    const vParams = {
      where: {
        id: video!.id!,
      },
      update: {},
      create: {
        id: video.id!,
        published_at: video.snippet!.publishedAt!.replace('T', ' ').replace('Z', ''),
        channel_id: video.snippet!.channelId!,
        title: video.snippet!.title!,
        type_id,
        is_short,
      },
    }
    const v = await executeQueryWithLogging(
      prisma.youtube_videos.upsert(vParams),
      'youtube_videos.upsert',
      vParams
    )
    const tags = [
      `youtube-channels`,
      `youtube-channel-${channel!.id!}`,
      `youtube-videos-by-channel-${channel!.id!}`,
      `youtube-videos-by-type-${type_id}`,
    ]
    for (const tag of tags) {
      revalidateTag(tag)
    }
    return { video: v }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}

const fetchVideoInfo = async (videoId: string) => {
  try {
    const videos = await youtube.videos.list({
      id: [videoId],
      part: ['id', 'snippet'],
      key: GOOGLE_API_KEY,
      hl: 'ja',
    })
    const videoItems = videos.data.items
    if (!videoItems || videoItems.length !== 1) {
      return { error: Errors.NotFound.message }
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
    return {
      video,
      title,
      is_short,
      type_id,
      channel,
    }
  } catch (e) {
    console.error(e)
    return undefined
  }
}
