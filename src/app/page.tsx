import Container from '@/components/commons/Container'
import MenuSection from '@/components/home/Menu/MenuSection'
import { Metadata } from 'next'

const title = '超ときめき♡研究部'
const description = 'ときめく何かを研究する超ときめき♡研究部（非公式）のページ'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default function Home() {
  return (
    <Container className="max-w-screen-sm text-center px-8 md:px-2">
      <div className="py-16 text-xs text-gray-500">ときめく何かを研究していきます</div>
      <div className="px-0 sm:px-8">
        <MenuSection
          title="超ときめき♡データベース"
          description="「超ときめき♡宣伝部」に関するデータをまとめています"
          items={[
            { icon: '🎼', name: '楽曲', href: '/songs' },
            { icon: '💿', name: 'レコード', href: '/records' },
            { icon: '🎤', name: 'アーティスト', href: '/artists' },
            { icon: '🎬', name: 'YouTube', href: '/youtube' },
            { icon: '👗', name: '衣装', href: '/costumes' },
            { icon: '🗓️', name: 'イベント', href: '/calendar' },
            { icon: '📝', name: '記事', href: '/articles' },
            { icon: '🎁', name: 'コンテンツ', href: '/articles', enabled: false },
          ]}
        />
        <MenuSection
          title="超ときめき♡研究部室"
          description="「超ときめき♡宣伝部」に関する便利ツールや記事など"
          items={[
            { icon: '📙', name: '部誌', href: '/posts' },
            { icon: '📷', name: '写真館', href: '/photos', enabled: false },
          ]}
        />
      </div>
    </Container>
  )
}
