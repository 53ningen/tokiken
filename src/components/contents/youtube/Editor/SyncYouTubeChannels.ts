'use server'

import prisma from '@/db/prisma'
import { YouTubeChannel } from '@/db/youtube-vidoes'
import { isAssociateUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { google } from 'googleapis'
import { revalidateTag } from 'next/cache'

const youtube = google.youtube('v3')

const { GOOGLE_API_KEY } = process.env

export const syncYouTubeChannels = async (): Promise<
  Either<string, YouTubeChannel[]>
> => {
  if (!(await isAssociateUserServer())) {
    return left('Unauthorized')
  }

  const channels = await prisma.youtube_channels.findMany()

  var updatedChannels: YouTubeChannel[] = []
  const chunkSize = 50
  for (let i = 0; i < channels.length; i += chunkSize) {
    const chunk = channels.slice(i, i + chunkSize)
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
          prisma.youtube_channels.update({
            where: {
              id: channel.id,
            },
            data: {
              title: retrivedChannel.snippet!.title!,
              thumbnail_url: retrivedChannel.snippet!.thumbnails!.medium!.url!,
            },
          })
          updatedChannels.push({
            id: channel.id,
            title: retrivedChannel.snippet?.title!,
            thumbnail_url: retrivedChannel.snippet?.thumbnails?.medium?.url!,
            sync_enabled: channel.sync_enabled,
            updated_at: new Date(),
          })
          console.log(
            'Updated',
            channel.id,
            retrivedChannel.snippet?.title,
            retrivedChannel.snippet?.thumbnails?.medium?.url
          )
        }
      }
    }
  }

  if (updatedChannels.length > 0) {
    revalidateTag('youtube-channels')
    for (const channel of updatedChannels) {
      const tags = [`youtube-channel-${channel.id}`]
      for (const tag of tags) {
        revalidateTag(tag)
        console.log(`RevalidateTag: ${tag}`)
      }
    }
  }

  return right(updatedChannels)
}
