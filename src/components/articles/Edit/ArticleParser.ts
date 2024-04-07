import { numToYYYYMMDD } from '@/utils/datetime'
import parse, { HTMLElement } from 'node-html-parser'

interface ArticleInfo {
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
    if (url.startsWith('https://natalie.')) {
      const res = parseNatalie(url, root)
      return res
    }
    if (url.startsWith('https://realsound.jp/')) {
      const res = parseRealSound(url, root)
      return res
    }
    if (url.startsWith('https://ototoy.jp/')) {
      const res = parseOtotoy(url, root)
      return res
    }
    if (url.startsWith('https://prtimes.jp/')) {
      const res = parsePrTimes(url, root)
      return res
    }
    if (url.startsWith('https://okmusic.jp/')) {
      const res = parseOkMusic(url, root)
      return res
    }
    if (url.startsWith('https://thetv.jp/')) {
      const res = parseTelevision(url, root)
      return res
    }
    if (url.startsWith('https://www.barks.jp/')) {
      const res = parseBarks(url, root)
      return res
    }
    if (url.startsWith('https://www.sanspo.com/')) {
      const res = parseSanspo(url, root)
      return res
    }
    if (url.startsWith('https://news.ntv.co.jp/')) {
      const res = parseNtvNews(url, root)
      return res
    }
    if (url.startsWith('https://avexnet.jp/')) {
      const res = parseAvexPortal(url, root)
      return res
    }
    if (url.startsWith('https://toki-sen.com/')) {
      const res = parseTokisenOfficial(url, root)
      return res
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

const parseNatalie = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式: 2024年4月6日 10:57
  const articleDate = dom.querySelector('.NA_article_date')?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const dtstring = articleDate
      .trim()
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', '')
    const dt = new Date(dtstring)
    const yyyymmdd = numToYYYYMMDD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
    const hhmm = `${dt.getHours().toString().padStart(2, '0')}:${dt
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
    const published_at = `${yyyymmdd} ${hhmm}`
    return { ...basicInfo, published_at }
  }
}

const parseRealSound = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式: 2024.04.02 16:00
  const articleDate = dom.querySelector('.entry-time')?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const published_at = articleDate.trim().replaceAll('.', '-')
    return { ...basicInfo, published_at }
  }
}

const parseOtotoy = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式: 2024年04月07日16時15分
  const articleDate = dom.querySelector('.post_time')?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const published_at = articleDate
      .trim()
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', ' ')
      .replace('時', ':')
      .replace('分', ' ')
      .replaceAll('/', '-')
    return { ...basicInfo, published_at }
  }
}

const parsePrTimes = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  const articleDate = dom.querySelector('time')?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const dtstring = articleDate
      .trim()
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', '')
      .replace('時', ':')
      .replace('分', ' ')
      .replaceAll('/', '-')
    const dt = new Date(dtstring)
    const yyyymmdd = numToYYYYMMDD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
    const hhmm = `${dt.getHours().toString().padStart(2, '0')}:${dt
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
    const published_at = `${yyyymmdd} ${hhmm}`
    return { ...basicInfo, published_at }
  }
}

const parseOkMusic = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式: 2024年03月13日 18:30
  const articleDate = dom.querySelector('time')?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const published_at = articleDate
      .trim()
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', '')
      .replace('時', ':')
      .replace('分', ' ')
    return { ...basicInfo, published_at }
  }
}

const parseTelevision = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式: 2024/04/07 10:00
  const articleDate = dom.querySelector('.timestamp')?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const published_at = articleDate.trim().replaceAll('/', '-')
    return { ...basicInfo, published_at }
  }
}

const parseBarks = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  const articleDate = dom.querySelector('time')?.getAttribute('datetime')
  if (!articleDate) {
    return basicInfo
  } else {
    const published_at = articleDate.replace('T', ' ').slice(0, 16)
    return { ...basicInfo, published_at, url }
  }
}

const parseSanspo = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式:  2016/11/09 20:23
  const articleDate = dom.querySelector('time')?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const published_at = articleDate.trim().replaceAll('/', '-')
    return { ...basicInfo, published_at }
  }
}

const parseNtvNews = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式: 2024年3月29日 22:50
  const articleDate = dom.querySelector(
    '.articleDetail-content-header-categories-meta-bottom-date'
  )?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const dtstring = articleDate
      .trim()
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', '')
    const dt = new Date(dtstring)
    const yyyymmdd = numToYYYYMMDD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
    const hhmm = `${dt.getHours().toString().padStart(2, '0')}:${dt
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
    const published_at = `${yyyymmdd} ${hhmm}`
    return { ...basicInfo, published_at }
  }
}

const parseAvexPortal = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式: 2020.06.22
  const articleDate = dom.querySelector('header.header-detail p span')?.innerText
  if (!articleDate) {
    return basicInfo
  } else {
    const dstring = articleDate.trim().replaceAll('.', '-')
    const dt = new Date(dstring)
    const yyyymmdd = numToYYYYMMDD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
    const hhmm = '00:00'
    const published_at = `${yyyymmdd} ${hhmm}`
    return { ...basicInfo, published_at, url }
  }
}

const parseTokisenOfficial = (url: string, dom: HTMLElement) => {
  const basicInfo = extractBasicInfo(url, dom)
  // 2024.04. 現在の形式: 2021-02-15
  const articleDate = dom.querySelector('time')?.getAttribute('datetime')
  if (!articleDate) {
    return basicInfo
  } else {
    const published_at = `${articleDate} 00:00`
    return { ...basicInfo, published_at }
  }
}
