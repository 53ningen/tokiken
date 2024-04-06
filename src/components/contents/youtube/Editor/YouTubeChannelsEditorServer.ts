'use server'

import { executeQueriesWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { listYouTubeChannels } from '@/db/youtube-channels'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { google } from 'googleapis'
import { revalidateTag } from 'next/cache'

const youtube = google.youtube('v3')
const { GOOGLE_API_KEY } = process.env

interface State {
  error?: string
  updatedChannels?: number
}

export const youtubeChannelsEditorAction = async (
  _: State,
  __: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }

  const channels = await listYouTubeChannels()
  const params: {
    where: { id: string }
    data: { title: string; thumbnail_url: string }
  }[] = []

  const chunkSize = 50
  for (let i = 0; i < channels.length; i += chunkSize) {
    const chunk = channels.slice(i, i + chunkSize)

    try {
      // 最新のチャンネル情報を取得
      const res = await youtube.channels.list({
        id: chunk.map((channel) => channel.id),
        key: GOOGLE_API_KEY,
        part: ['id', 'snippet'],
        hl: 'ja',
      })
      for (const channel of chunk) {
        const retrivedChannel = res.data.items?.find((i) => i.id === channel.id)
        if (!retrivedChannel) {
          console.error('Channel not found', channel.id)
        } else {
          const needUpdate =
            channel.title !== retrivedChannel.snippet?.title ||
            channel.thumbnail_url !== retrivedChannel.snippet?.thumbnails?.medium?.url
          if (needUpdate) {
            params.push({
              where: {
                id: channel.id,
              },
              data: {
                title: retrivedChannel.snippet!.title!,
                thumbnail_url: retrivedChannel.snippet!.thumbnails!.medium!.url!,
              },
            })
          }
        }
      }
    } catch (e) {
      console.error('YouTube API Error', e)
      return { error: Errors.YouTubeAPIError.message }
    }
  }
  const queries = params.map((p) => prisma.youtube_channels.update(p))
  const res = await executeQueriesWithLogging(
    queries,
    'youtube_channels.bulk_update',
    params
  )
  if (res.length > 0) {
    revalidateTag('youtube-channels')
    for (const p of params) {
      const tags = [`youtube-channel-${p.where.id}`]
      for (const tag of tags) {
        revalidateTag(tag)
      }
    }
  }
  return {
    updatedChannels: params.length,
  }
}
