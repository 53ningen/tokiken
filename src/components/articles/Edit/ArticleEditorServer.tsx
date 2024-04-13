'use server'

import { Article, articlesDateTag } from '@/db/articles'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import { ulid } from 'ulid'
import { parseArticle } from './ArticleParser'

interface State {
  id: string
  error?: string
  url?: string
  title?: string
  thumbnail_url?: string
  published_at?: string
  article?: Article
}

export const articleEditorAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { ...state, article: undefined, error: Errors.NeedAssociatePermission.message }
  }

  const action = data.get('action') as string
  if (action === 'insert') {
    const url = data.get('url') as string
    const title = data.get('title') as string
    const thumbnail_url = data.get('thumbnail_url') as string
    const published_at = data.get('published_at') as string
    if (!url || !title || !published_at) {
      return { ...state, error: Errors.InvalidRequest.message }
    }
    try {
      const exists = await prisma.articles.findFirst({ where: { url } })
      if (exists) {
        return { ...state, article: undefined, error: Errors.AlreadyExists.message }
      }
      const params = {
        data: {
          url,
          title,
          thumbnail_url,
          published_at: published_at.replaceAll('T', ' '),
        },
      }
      const res = await executeQueryWithLogging(
        prisma.articles.create(params),
        'articles.create',
        params
      )
      const year = parseInt(published_at.slice(0, 4))
      const month = parseInt(published_at.slice(5, 7))
      revalidateTag(articlesDateTag(year, month))
      return { article: res, id: ulid() }
    } catch (e) {
      console.error(e)
      return { ...state, article: undefined, error: Errors.DatabaseError.message }
    }
  }

  if (action === 'preload') {
    const url = data.get('url') as string
    if (!url) {
      return { ...state, article: undefined, error: Errors.InvalidRequest.message }
    }
    try {
      const res = await parseArticle(url)
      return {
        ...state,
        error: undefined,
        article: undefined,
        id: ulid(),
        url,
        title: res?.title,
        thumbnail_url: res?.thumbnail_url,
        published_at: res?.published_at,
      }
    } catch (e) {
      console.error(e)
      return { ...state, article: undefined, error: Errors.InvalidRequest.message }
    }
  }

  return state
}
