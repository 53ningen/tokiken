'use server'

import { Article, searchArticlesByDate, searchArticlesByWord } from '@/db/articles'
import { Event, eventArticlesTag, listEventArticles } from '@/db/events'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import EventArticleEditor from './EventArticleEditor'

interface Props {
  event: Event
}

const EventArticleEditorWrapper = async ({ event }: Props) => {
  const articles = await listEventArticles(event.id)()
  return <EventArticleEditor event={event} articles={articles} />
}

export default EventArticleEditorWrapper

interface State {
  items: Article[]
  error?: string
}

export const eventArticleEditorAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { ...state, error: Errors.NeedAssociatePermission.message }
  }
  const event_id = parseInt(data.get('event_id') as string)
  const action = data.get('action') as string
  if (isNaN(event_id) || !action) {
    return { ...state, error: Errors.InvalidRequest.message }
  }

  // 検索ワードで記事を検索
  if (action === 'search-by-title') {
    console.log('search-by-title')
    const word = data.get('word') as string
    if (!word || word.length < 3) {
      return { ...state, error: Errors.InvalidRequest.message }
    }
    try {
      const articles = await searchArticlesByWord(word)()
      return { items: articles, error: undefined }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }

  // 日付で記事を検索
  if (action === 'search-by-date') {
    console.log('search-by-date')
    const date = data.get('date') as string
    if (!date) {
      return { ...state, error: Errors.InvalidRequest.message }
    }
    try {
      const articles = await searchArticlesByDate(date)()
      return { items: articles, error: undefined }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }

  // 記事を追加
  const add = action.match(/add:(\d+)/)
  const addId = parseInt(add ? add[1] : '')
  if (!isNaN(addId) && addId > 0) {
    const params = {
      data: {
        event_id,
        article_id: addId,
      },
    }
    try {
      await executeQueryWithLogging(
        prisma.event_articles.create(params),
        'event_articles.create',
        params
      )
      revalidateTag(eventArticlesTag(event_id))
      return { ...state, error: undefined }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }

  // 記事を削除
  const del = action.match(/delete:(\d+)/)
  const delId = parseInt(del ? del[1] : '')
  if (!isNaN(delId) && delId > 0) {
    const params = {
      where: {
        event_id,
        article_id: delId,
      },
    }
    try {
      await executeQueryWithLogging(
        prisma.event_articles.deleteMany(params),
        'event_articles.delete',
        params
      )
      revalidateTag(eventArticlesTag(event_id))
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
