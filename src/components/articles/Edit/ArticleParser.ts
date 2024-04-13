import parse, { HTMLElement } from 'node-html-parser'
import { ArticleSites } from '../ArticleSites'

export interface ArticleInfo {
  url: string
  title?: string
  thumbnail_url?: string
  published_at?: string
}

export const parseArticle = async (url: string): Promise<ArticleInfo | undefined> => {
  try {
    const response = await fetch(url)
    const text = await response.text()
    const root = parse(text)
    for (const site of ArticleSites) {
      if (url.startsWith(site.articleUrlStartWith) && site.parseArticle) {
        const res = site.parseArticle(url, root)
        return res
      }
    }
    return extractBasicInfo(url, root)
  } catch (e) {
    console.error(e)
  }
  return undefined
}

const extractBasicInfo = (url: string, root: HTMLElement) => {
  const cleanUrl = url.split('?')[0]
  const title = root.querySelector('title')?.text
  const meta = root.querySelectorAll('meta')
  const thumbnail_url = meta
    .find((m) => m.getAttribute('property') === 'og:image')
    ?.getAttribute('content')
  return { url: cleanUrl, title, thumbnail_url }
}
