import { getYouTubeChannel } from '@/db/youtube-channels'
import { Metadata } from 'next'

interface Props {
  params: { id?: string; page?: string }
}

export const generateStaticParams = async () => {
  return []
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata | null> => {
  const { id } = params
  const page = parseInt((params.page as string) || '1')
  if (!id || isNaN(page) || page < 1) {
    return null
  }
  const cachedChannel = getYouTubeChannel(id)
  const channel = await cachedChannel()
  if (!channel) {
    return null
  } else {
    const title = `${channel.title} - 超ときめき♡YouTubeデータベース`
    const description = `超ときめき♡宣伝部の関連YouTubeチャンネル: ${channel.title} のデータ`
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
