import ArticleList from '@/components/articles/ArticleList'
import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import DateNavigation from '@/components/commons/DateNavigation'
import Title from '@/components/commons/Title'
import { listArticles } from '@/db/articles'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: { yyyymm: string }
}

export const generateStaticParams = async () => {
  return []
}

const Articles = async ({ params }: Props) => {
  if (params.yyyymm.length !== 6) {
    notFound()
  }

  const yyyymm = parseInt(params.yyyymm)
  if (isNaN(yyyymm) || yyyymm < 1) {
    notFound()
  }
  const year = Math.floor(yyyymm / 100)
  const month = yyyymm % 100
  const now = new Date()
  const untilYYYYMM = (now.getFullYear() + 2) * 100 + now.getMonth()
  const isValidDate =
    201504 <= yyyymm && yyyymm <= untilYYYYMM && 1 <= month && month <= 12
  if (!isValidDate) {
    notFound()
  }
  const articles = await listArticles(year, month)()
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: '超ときめき♡記事データベース', href: '/articles' }]} />
      <Title
        title={`${year}年${month}月の記事`}
        description="超ときめき♡宣伝部に関する記事"
      />
      <DateNavigation
        since={new Date(2015, 4, 11)}
        date={new Date(year, month - 1)}
        path="/articles"
      />
      <div className="pb-4 text-right">
        <Link href={`/calendar/${yyyymm}`} className="text-primary text-sm">
          🗓️ {year}年{month}月のイベント一覧ページ
        </Link>
      </div>
      {articles.length > 0 ? (
        <ArticleList articles={articles} />
      ) : (
        <div className="pt-16 pb-96 text-gray-500">
          登録されている記事はありませんでした
        </div>
      )}
      <DateNavigation
        since={new Date(2015, 4, 11)}
        date={new Date(year, month - 1)}
        path="/articles"
      />
    </Container>
  )
}

export default Articles
