'use server'

import { Costume } from '@/db/costumes'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import {
  YouTubeVideo,
  listYouTubeVideosByCostume,
  searchYouTubeVideosByDate,
  searchYouTubeVideosByWord,
  youtubeVideosByCostumeTag,
} from '@/db/youtube-vidoes'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import CostumeYouTubeVideoEditor from './CostumeYouTubeVideoEditor'

interface Props {
  costume: Costume
}

const CostumeYouTubeVideoEditorWrapper = async ({ costume }: Props) => {
  const videos = await listYouTubeVideosByCostume(costume.id)()
  return <CostumeYouTubeVideoEditor costume={costume} videos={videos} />
}

export default CostumeYouTubeVideoEditorWrapper

interface State {
  items: YouTubeVideo[]
  error?: string
}

export const costumeYouTubeVideoEditorAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { ...state, error: Errors.NeedAssociatePermission.message }
  }
  const costume_id = parseInt(data.get('costume_id') as string)
  const action = data.get('action') as string
  if (isNaN(costume_id) || !action) {
    return { ...state, error: Errors.InvalidRequest.message }
  }

  // 検索ワードで動画を検索
  if (action === 'search-by-title') {
    const word = data.get('word') as string
    if (!word || word.length < 3) {
      return { ...state, error: Errors.InvalidRequest.message }
    }
    try {
      const videos = await searchYouTubeVideosByWord(word)()
      return { items: videos, error: undefined }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }

  // 日付で記事を検索
  if (action === 'search-by-date') {
    const date = data.get('date') as string
    if (!date) {
      return { ...state, error: Errors.InvalidRequest.message }
    }
    try {
      const videos = await searchYouTubeVideosByDate(date)()
      return { items: videos, error: undefined }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }

  // 動画を追加
  const add = action.split('add:')
  const addId = add.length === 2 ? add[1] : undefined
  if (addId && addId !== '') {
    const params = {
      data: {
        costume_id,
        video_id: addId,
      },
    }
    try {
      await executeQueryWithLogging(
        prisma.youtube_video_costumes.create(params),
        'youtube_video_costumes.create',
        params
      )
      revalidateTag(youtubeVideosByCostumeTag(costume_id))
      return { ...state, error: undefined }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }

  // 動画を削除
  const del = action.split('delete:')
  const delId = del.length === 2 ? del[1] : undefined
  if (delId && delId !== '') {
    const params = {
      where: {
        costume_id,
        video_id: delId,
      },
    }
    try {
      await executeQueryWithLogging(
        prisma.youtube_video_costumes.deleteMany(params),
        'youtube_video_costumes.deleteMany',
        params
      )
      revalidateTag(youtubeVideosByCostumeTag(costume_id))
      return { ...state, error: undefined }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }

  return {
    ...state,
    error: Errors.InvalidRequest.message,
  }
}
