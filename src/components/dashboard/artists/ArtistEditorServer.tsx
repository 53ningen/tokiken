'use server'

import { Artist, artistsTag } from '@/db/artists'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
interface State {
  error?: string
  artist?: Artist
}

export const artistEditorAction = async (_: State, data: FormData): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }

  const name = data.get('name') as string
  const kana = data.get('kana') as string
  const slug = data.get('slug') as string
  const wikipedia = data.get('wikipedia') as string
  const twitter = data.get('twitter') as string
  const instagram = data.get('instagram') as string
  const tiktok = data.get('tiktok') as string
  const url = data.get('url') as string
  if (!name || !kana || !slug) {
    return { error: Errors.InvalidRequest.message }
  }

  try {
    const params = {
      data: {
        name,
        kana,
        slug,
        wikipedia_slug: wikipedia,
        twitter_screenname: twitter,
        instagram_id: instagram,
        tiktok_id: tiktok,
        url,
      },
    }
    const res = await executeQueryWithLogging(
      prisma.artists.create(params),
      'artists.create',
      params
    )
    revalidateTag(artistsTag)
    return { artist: res, error: undefined }
  } catch (error) {
    console.error(error)
    return { error: Errors.DatabaseError.message }
  }
}
