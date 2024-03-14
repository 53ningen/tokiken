import prisma from '@/db/prisma'
import { google } from 'googleapis'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { getVideoTypeId, isShortVideo } from '../../video_types'

const youtube = google.youtube('v3')

export const dynamic = 'force-dynamic'

const { API_KEY, GOOGLE_API_KEY } = process.env

interface Params {
  params: { id: string }
}

export const PUT = async (request: Request, { params }: Params) => {
  const videoId = params.id
  try {
    const ACTION_KEY = request.headers.get('authorization')
    if (API_KEY === ACTION_KEY) {
      return await putVideo(videoId)
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

const putVideo = async (videoId: string) => {
  const videos = await youtube.videos.list({
    id: [videoId],
    part: ['id', 'snippet'],
    key: GOOGLE_API_KEY,
    hl: 'ja',
  })
  const videoItems = videos.data.items
  if (!videoItems || videoItems.length !== 1) {
    return NextResponse.json({ message: `Video Not Found: ${videoId}` }, { status: 404 })
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

  const updated_data = await prisma.$transaction([
    prisma.youtube_channels.upsert({
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
    }),
    prisma.youtube_videos.upsert({
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
    }),
  ])

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
  return NextResponse.json({ message: 'Success', updated_data }, { status: 200 })
}
