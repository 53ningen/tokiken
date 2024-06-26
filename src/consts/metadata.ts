/** サイトや各種メタデータに関する定数群 */

import { S3ClientConfig } from '@aws-sdk/client-s3'

export const noImageUrl = 'https://tokiken.com/noimage.png'

export const inquiryFormUrl =
  'https://docs.google.com/forms/d/1E3EOsHMNFk6R0BUHmUFy_e1NQdtucLMQ0TmKV7L0PKY/viewform?pli=1&pli=1&edit_requested=true'

export const amazonThubnailUrl = (asin: string | undefined | null) =>
  asin
    ? `https://images-fe.ssl-images-amazon.com/images/P/${asin}.09.LZZZZZZZ`
    : undefined

export const amazonProductUrl = (asin: string) =>
  `https://www.amazon.co.jp/dp/${asin}/ref=nosim?tag=${process.env.NEXT_PUBLIC_ASSOCIATE_ID}`

export const youtubeThumbnailUrl = (videoId: string | undefined | null) =>
  videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : undefined

export const youtubeVideoUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`

export const imageUrl = (imageKey?: string) => {
  const base = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL
  return imageKey ? `${base}/${imageKey}` : noImageUrl
}

export const costumeImageUrl = (size: 'xs' | 'md' | 'lg', imageKey?: string) => {
  const key = imageKey
    ? encodeURIComponent(`costumes/${imageKey}.${size}.png`)
    : undefined
  const url = imageUrl(key)
  return url
}

export const r2S3ClientConfig: S3ClientConfig = {
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_URL as string,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY as string,
    secretAccessKey: process.env.CLOUDFLARE_R2_ACCESS_SECRET as string,
  },
}
