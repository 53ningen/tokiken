'use server'

import { articlesByDateTag, articlesTag } from '@/db/articles'
import { executeQueriesWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAdminUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import parse from 'node-html-parser'
import { ArticleInfo, parseArticle } from './ArticleParser'
import { ArticleSites } from './ArticleSites'

interface State {
  error?: string
  items?: ArticleInfo[]
  inserted?: number
}

export const articleSynchronizerAction = async (state: State, data: FormData) => {
  if (!(await isAdminUserServer())) {
    return { error: Errors.NeedAdminPermission.message }
  }

  const action = data.get('action') as string
  if (action === 'fetch') {
    const newState = await fetchAction(data)
    return newState
  }
  if (action === 'sync') {
    const newState = await syncAction(state)
    revalidateTag('articles')
    return newState
  }
  return { error: Errors.InvalidRequest.message }
}

const fetchAction = async (data: FormData): Promise<State> => {
  try {
    const site = data.get('site') as string
    const page = parseInt(data.get('page') as string)
    const siteModel = ArticleSites.find((s) => s.id === site)
    if (isNaN(page) || !siteModel || !siteModel.parseArticleList || !siteModel.syncUrl) {
      return { error: Errors.InvalidRequest.message }
    }
    const url = siteModel.syncUrl(page)
    const res = await fetch(url)
    if (!res.ok) {
      return { error: Errors.ServerError.message }
    }
    const text = await res.text()
    const dom = parse(text)
    const targetUrls = siteModel.parseArticleList(url, dom)
    const existingUrls = await prisma.articles.findMany({
      select: { url: true },
      where: { url: { in: targetUrls } },
    })
    const diffUrls = targetUrls.filter((url) => !existingUrls.some((a) => a.url === url))
    const items: ArticleInfo[] = []
    for (const u of diffUrls) {
      const info = await parseArticle(u)
      if (info) {
        items.push(info)
      }
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
    return { items }
  } catch (e) {
    return { error: Errors.ServerError.message }
  }
}

const syncAction = async (state: State): Promise<State> => {
  if (!state.items) {
    return { ...state, error: Errors.InvalidRequest.message }
  }
  try {
    const params = state.items.map((item) => {
      return {
        data: {
          title: item.title!,
          url: item.url!,
          published_at: item.published_at!,
          thumbnail_url: item.thumbnail_url!,
        },
      }
    })
    const promises = params.map((p) => prisma.articles.create(p))
    await executeQueriesWithLogging(promises, 'articles.bulk_create', params)
    for (const item of state.items) {
      const published_at = item.published_at
      if (published_at) {
        revalidateTag(articlesByDateTag(published_at))
      }
    }
    revalidateTag(articlesTag)
    return { ...state, inserted: params.length, items: undefined }
  } catch (e) {
    console.error(e)
    return { ...state, error: Errors.ServerError.message }
  }
}
