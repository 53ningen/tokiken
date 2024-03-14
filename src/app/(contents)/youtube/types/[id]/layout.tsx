import { getYouTubeVideoType } from '@/db/youtube-types'
import { Metadata } from 'next'

interface Props {
  params: { id?: string; page?: string }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata | null> => {
  const id = params.id ? parseInt(params.id) : undefined
  const page = parseInt((params.page as string) || '1')
  if (!id || isNaN(page) || page < 1) {
    return null
  }
  const type = await getYouTubeVideoType(id)
  if (!type) {
    return null
  } else {
    const title = `${type.name} - 超ときめき♡YouTubeデータベース`
    const description = `超ときめき♡宣伝部の関連YouTube動画ジャンル: ${type.name} のデータ`
    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
