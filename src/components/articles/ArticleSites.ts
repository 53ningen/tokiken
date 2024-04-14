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
    label: '超ときめき♡宣伝部',
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
    id: 'tokipedia',
    label: '#超ときぺディア',
    articleUrlStartWith: 'https://friday.gold/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      const articleDate = dom.querySelector('time')?.getAttribute('datetime')
      if (!articleDate) {
        return basicInfo
      } else {
        // 2024-02-15T10:30:00+09:00 => 2024-02-15 10:30
        const published_at = articleDate.trim().replace('T', ' ').slice(0, 16)
        return { ...basicInfo, published_at }
      }
    },
    syncUrl: (_) => `https://friday.gold/gravure/feature/tokipedia`,
    parseArticleList: (_, dom) => {
      const urls = dom
        .querySelectorAll('div.css-1ygnsf3 ul > li.css-18t1zqn > a:first-child')
        .flatMap((a) => {
          const href = a.getAttribute('href')
          return href && (href.startsWith('/article') || href.startsWith('/gravure'))
            ? [`https://friday.gold${href}`.split('?')[0]]
            : []
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
    parseArticleList: (_, dom) => {
      const urls = dom
        .querySelectorAll('.entry-list article .entry-thumb > a')
        .flatMap((a) => {
          const href = a.getAttribute('href')
          return href ? [href] : []
        })
      return urls
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
    syncUrl: (_) =>
      `https://prtimes.jp/topics/keywords/%E8%B6%85%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E2%99%A1%E5%AE%A3%E4%BC%9D%E9%83%A8`,
    parseArticleList: (_, dom) => {
      const urls = dom
        .querySelectorAll(
          'div.container-thumbnail-list article div.thumbnail-title-wrap > a'
        )
        .flatMap((a) => {
          const href = a.getAttribute('href')
          return href ? [`https://prtimes.jp${href}`.split('?')[0]] : []
        })
      return urls
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
    syncUrl: (page) => `https://members.barks.jp/artists/barks/1000004939?page=${page}`,
    parseArticleList: (_, dom) => {
      const urls = dom
        .querySelectorAll('ul > li > a.artist-contents-item')
        .flatMap((a) => {
          const href = a.getAttribute('href')
          return href ? [href] : []
        })
      return urls
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
  {
    id: 'stardust-web',
    label: 'STARDUST WEB',
    articleUrlStartWith: 'https://fc.stardust.co.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 2024.04. 現在の形式: 2020.06.22
      const articleDate = dom.querySelector('article time')?.innerText
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
  {
    id: 'sportshochi',
    label: 'スポーツ報知',
    articleUrlStartWith: 'https://hochi.news/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 時刻形式: 2021年2月27日 11時27分
      const articleDate = dom.querySelector('div.article__wrap time')?.innerText
      if (!articleDate) {
        return basicInfo
      } else {
        const dtstring = articleDate
          .trim()
          .replace('年', '-')
          .replace('月', '-')
          .replace('日', '')
          .replace('時', ':')
          .replace('分', '')
        const dt = new Date(dtstring)
        const yyyymmdd = numToYYYYMMDD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
        const hhmm = `${dt.getHours().toString().padStart(2, '0')}:${dt
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
        const published_at = `${yyyymmdd} ${hhmm}`
        return { ...basicInfo, published_at, url }
      }
    },
    syncUrl: (_) =>
      `https://hochi.news/search?q=%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E2%99%A1%E5%AE%A3%E4%BC%9D%E9%83%A8`,
    parseArticleList: (_, dom) => {
      const urls = dom.querySelectorAll('ul.article-list li a').flatMap((a) => {
        const href = a.getAttribute('href')
        return href ? [`https://hochi.news${href}`.split('?')[0]] : []
      })
      return urls
    },
  },
  {
    id: 'towerrecords',
    label: 'TOWER RECORDS',
    articleUrlStartWith: 'https://tower.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 時刻形式:  2024.1.3
      var articleDate = dom.querySelector(
        '.storeAtcl-atclDate > li:first-child'
      )?.innerText
      if (!articleDate) {
        articleDate = dom.querySelector('.inMdl-atclDetailDate p:nth-child(2)')?.innerText
        if (!articleDate) {
          return basicInfo
        }
      }
      const dstring = articleDate
        .trim()
        .replace('掲載：', '')
        .replace('掲載日：', '')
        .replaceAll('/', '-')
      const dt = new Date(dstring)
      const yyyymmdd = numToYYYYMMDD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
      const hhmm = '00:00'
      const published_at = `${yyyymmdd} ${hhmm}`
      return { ...basicInfo, published_at, url }
    },
    syncUrl: (page) =>
      `https://tower.jp/search/article/%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E2%99%A1%E5%AE%A3%E4%BC%9D%E9%83%A8?page=${page}`,
    parseArticleList: (_, dom) => {
      const urls = dom
        .querySelectorAll('ul li .articleTitle a')
        .flatMap((a) => {
          const href = a.getAttribute('href')
          return href ? [href] : []
        })
        .map((a) => `https://tower.jp${a}`)
      return urls
    },
  },
  {
    id: 'spice',
    label: 'SPICE',
    articleUrlStartWith: 'https://spice.eplus.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 時刻形式:  2024.1.3
      const articleDate = dom.querySelector('.article-detail div.time')?.innerText
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
    syncUrl: (page) =>
      `https://spice.eplus.jp/articles/search?special_flag%5B0%5D=0&keywords%5B0%5D=%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E2%96%BD%E5%AE%A3%E4%BC%9D%E9%83%A8&p=${page}`,
    parseArticleList: (_, dom) => {
      const urls = dom
        .querySelectorAll('ul.article-list li > a:first-child')
        .flatMap((a) => {
          const href = a.getAttribute('href')
          return href ? [href] : []
        })
        .map((a) => `https://spice.eplus.jp${a}`)
      return urls
    },
  },
  {
    id: 'hustlepress',
    label: 'HUSTLE PRESS',
    articleUrlStartWith: 'https://hustlepress.co.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 時刻形式:  2021年 1月 05日
      const articleDate = dom.querySelector('div.post-meta-blog span')?.innerText
      if (!articleDate) {
        return basicInfo
      } else {
        const dstring = articleDate
          .trim()
          .replaceAll(' ', '')
          .replace('年', '-')
          .replace('月', '-')
          .replace('日', '')
        const dt = new Date(dstring)
        const yyyymmdd = numToYYYYMMDD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
        const hhmm = '00:00'
        const published_at = `${yyyymmdd} ${hhmm}`
        return { ...basicInfo, published_at, url }
      }
    },
    syncUrl: (page) =>
      `https://hustlepress.co.jp/page/${page}/?s=%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E2%99%A1%E5%AE%A3%E4%BC%9D%E9%83%A8`,
    parseArticleList: (_, dom) => {
      const urls = dom.querySelectorAll('.blogposts-inner h3 a').flatMap((a) => {
        const href = a.getAttribute('href')
        return href ? [href] : []
      })
      return urls
    },
  },
  {
    id: 'tbsnewsdig',
    label: 'TBS NEWS DIG',
    articleUrlStartWith: 'https://newsdig.tbs.co.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      const articleDate = dom.querySelector('time')?.getAttribute('datetime')
      if (!articleDate) {
        return basicInfo
      } else {
        // 2023-12-15T18:51:07+09:00
        const published_at = articleDate.slice(0, 16).replace('T', ' ')
        return { ...basicInfo, published_at }
      }
    },
  },
  {
    id: 'universalmusic',
    label: 'UNIVERSAL MUSIC JAPAN',
    articleUrlStartWith: 'https://www.universal-music.co.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      const articleDate = dom.querySelector('span.tags__date')?.innerText
      if (!articleDate) {
        return basicInfo
      } else {
        // 2016.10.04 -> 2016-10-04 00:00
        const published_at = `${articleDate.trim().replaceAll('.', '-')} 00:00`
        return { ...basicInfo, published_at }
      }
    },
  },
  {
    id: 'nikkansport',
    label: '日刊スポーツ',
    articleUrlStartWith: 'https://www.nikkansports.com/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      const articleDate = dom.querySelector('header.article-title time')?.innerText
      if (!articleDate) {
        return basicInfo
      } else {
        const dstring = articleDate
          .trim()
          .replace('[', '')
          .replace(']', '')
          .replace('年', '-')
          .replace('月', '-')
          .replace('日', ' ')
          .replace('時', ':')
          .replace('分', '')
        const dt = new Date(dstring)
        const yyyymmdd = numToYYYYMMDD(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
        const published_at = `${yyyymmdd} ${dt
          .getHours()
          .toString()
          .padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`
        return { ...basicInfo, published_at, url }
      }
    },
  },
  {
    id: 'galpo',
    label: 'ガルポ！',
    articleUrlStartWith: 'https://galpo.info/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 2020.06.22 -> 2020-06-22 00:00
      const articleDate = dom.querySelector(
        'div.title_area div.box_wrap div.box_bl'
      )?.innerText
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
  {
    id: 'ciao',
    label: 'ちゃおプラス',
    articleUrlStartWith: 'https://ciao.shogakukan.co.jp/',
    parseArticle: (url, dom) => {
      const basicInfo = extractBasicInfo(url, dom)
      // 2020.06.22 -> 2020-06-22 00:00
      const articleDate = dom.querySelector('time.article__time')?.innerText
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
    syncUrl: (_) =>
      `https://ciao.shogakukan.co.jp/topics/tag/%E8%B6%85%E3%81%A8%E3%81%8D%E3%82%81%E3%81%8D%E2%99%A1%E5%AE%A3%E4%BC%9D%E9%83%A8/`,
    parseArticleList: (_, dom) => {
      const urls = dom.querySelectorAll('ul.card-list > li > a').flatMap((a) => {
        const href = a.getAttribute('href')
        return href ? [href] : []
      })
      return urls
    },
  },
]

const extractBasicInfo = (url: string, root: HTMLElement) => {
  const cleanUrl = url.split('?')[0]
  const title = root.querySelector('title')?.text.trim()
  const meta = root.querySelectorAll('meta')
  const thumbnail_url = meta
    .find((m) => m.getAttribute('property') === 'og:image')
    ?.getAttribute('content')
  return { url: cleanUrl, title, thumbnail_url }
}
