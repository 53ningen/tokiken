import { numToYYYYMMDD } from '@/utils/datetime'
import { HTMLElement } from 'node-html-parser'

interface ArticleSite {
  id: string
  label: string
  articleUrlStartWith: string
  syncUrl?: (page: number) => string
  parseArticle?: (
    url: string,
    dom: HTMLElement
  ) => { url: string; title?: string; thumbnail_url?: string; published_at?: string }
  parseArticleList?: (url: string, dom: HTMLElement) => string[]
}

export const ArticleSites: ArticleSite[] = [
  {
    id: 'natalie',
    label: 'ナタリー',
    articleUrlStartWith: 'https://natalie.',
    syncUrl: (i) => `https://natalie.mu/music/news/list/page/${i}/artist_id/98725`,
    parseArticle: (url, dom) => {
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
    },
    parseArticleList: (_, dom) => {
      const urls = dom
        .querySelectorAll('div.GAE_relatedArtistNews div.NA_card_wrapper div.NA_card > a')
        .flatMap((a) => {
          const href = a.getAttribute('href')
          return href ? [href] : []
        })
      return urls
    },
  },
  {
    id: 'tokisen',
    label: '超ときめき♡宣伝部公式',
    articleUrlStartWith: 'https://toki-sen.com/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 2024.04. 現在の形式: 2021-02-15
      const articleDate = dom.querySelector('time')?.getAttribute('datetime')
      if (!articleDate) {
        return basicInfo
      } else {
        const published_at = `${articleDate} 00:00`
        return { ...basicInfo, published_at }
      }
    },
    syncUrl: (i) => `https://toki-sen.com/contents/news/page/${i}`,
    parseArticleList: (_, dom) => {
      const urls = dom.querySelectorAll('ol.contents-list li > a').flatMap((a) => {
        const href = a.getAttribute('href')
        return href ? [`https://toki-sen.com${href}`.split('?')[0]] : []
      })
      return urls
    },
  },
  {
    id: 'realsound',
    label: 'Real Sound',
    articleUrlStartWith: 'https://realsound.jp/',
    syncUrl: (i) =>
      `https://realsound.jp/tag/%e8%b6%85%e3%81%a8%e3%81%8d%e3%82%81%e3%81%8d%e2%99%a1%e5%ae%a3%e4%bc%9d%e9%83%a8/page/${i}`,
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 2024.04. 現在の形式: 2024.04.02 16:00
      const articleDate = dom.querySelector('.entry-time')?.innerText
      if (!articleDate) {
        return basicInfo
      } else {
        const published_at = articleDate.trim().replaceAll('.', '-')
        return { ...basicInfo, published_at }
      }
    },
  },
  {
    id: 'ototoy',
    label: 'OTOTOY',
    articleUrlStartWith: 'https://ototoy.jp/',
    syncUrl: (_) =>
      `https://ototoy.jp/news/?tag=%E8%B6%85%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E2%99%A1%E5%AE%A3%E4%BC%9D%E9%83%A8`,
    parseArticle: (url, dom) => {
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
    },
  },
  {
    id: 'prtimes',
    label: 'PR TIMES',
    articleUrlStartWith: 'https://prtimes.jp/',
    parseArticle: (url, dom) => {
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
    },
  },
  {
    id: 'okmusic',
    label: 'OKMusic',
    articleUrlStartWith: 'https://okmusic.jp/',
    parseArticle: (url, dom) => {
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
    },
    syncUrl: (i) =>
      `https://okmusic.jp/%E8%B6%85%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E2%99%A1%E5%AE%A3%E4%BC%9D%E9%83%A8/news?page=${i}`,
    parseArticleList: (_, dom) => {
      const urls = dom
        .querySelectorAll('ul.artist-information_box li div.text_frame > a')
        .flatMap((a) => {
          const href = a.getAttribute('href')
          return href ? [`https://okmusic.jp${href}`.split('?')[0]] : []
        })
      return urls
    },
  },
  {
    id: 'barks',
    label: 'BARKS',
    articleUrlStartWith: 'https://www.barks.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      const articleDate = dom.querySelector('time')?.getAttribute('datetime')
      if (!articleDate) {
        return basicInfo
      } else {
        const published_at = articleDate.replace('T', ' ').slice(0, 16)
        return { ...basicInfo, published_at, url }
      }
    },
  },
  {
    id: 'sanspo',
    label: 'サンスポ',
    articleUrlStartWith: 'https://www.sanspo.com/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 2024.04. 現在の形式:  2016/11/09 20:23
      const articleDate = dom.querySelector('time')?.innerText
      if (!articleDate) {
        return basicInfo
      } else {
        const published_at = articleDate.trim().replaceAll('/', '-')
        return { ...basicInfo, published_at }
      }
    },
  },
  {
    id: 'thetv',
    label: 'ザ・テレビジョン',
    articleUrlStartWith: 'https://thetv.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 2024.04. 現在の形式: 2024/04/07 10:00
      const articleDate = dom.querySelector('.timestamp')?.innerText
      if (!articleDate) {
        return basicInfo
      } else {
        const published_at = articleDate.trim().replaceAll('/', '-')
        return { ...basicInfo, published_at }
      }
    },
    syncUrl: (i) =>
      `https://thetv.jp/news/tag/%E8%B6%85%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E5%AE%A3%E4%BC%9D%E9%83%A8/p${i}/`,
    parseArticleList: (_, dom) => {
      const urls = dom.querySelectorAll('div.news_results > ul > li > a').flatMap((a) => {
        const href = a.getAttribute('href')
        return href ? [`https://thetv.jp${href}`.split('?')[0]] : []
      })
      return urls
    },
  },
  {
    id: 'ntvnews',
    label: '日テレNEWS24',
    articleUrlStartWith: 'https://news.ntv.co.jp/',
    parseArticle: (url, dom) => {
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
    },
  },
  {
    id: 'avex',
    label: 'avex portal',
    articleUrlStartWith: 'https://avexnet.jp/',
    parseArticle: (url, dom) => {
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
    },
  },
]

const extractBasicInfo = (url: string, root: HTMLElement) => {
  const cleanUrl = url.split('?')[0]
  const title = root.querySelector('title')?.text
  const meta = root.querySelectorAll('meta')
  const thumbnail_url = meta
    .find((m) => m.getAttribute('property') === 'og:image')
    ?.getAttribute('content')
  return { url: cleanUrl, title, thumbnail_url }
}
