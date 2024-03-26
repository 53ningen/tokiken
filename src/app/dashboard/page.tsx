import Container from '@/components/commons/Container'
import SectionHeading from '@/components/commons/SectionHeading'
import Title from '@/components/commons/Title'
import RevalidateTagForm from '@/components/dashboard/RevalidateTagForm'
import Link from 'next/link'

const title = '超ときめき♡研究部室'
const description = '超ときめき♡研究部 管理者用ページ'

const Dashboard = () => {
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Title title={title} description={description} />
      <div className="grid gap-8 text-left [&_a]:text-primary">
        <div className="flex flex-col">
          <SectionHeading title="各種データ管理" />
          <Link href="/events/edit">🏟️ イベント/イベント会場データ管理</Link>
          <Link href="/youtube/edit">🎬 YouTube データ管理</Link>
        </div>
        <RevalidateTagForm />
      </div>
    </Container>
  )
}

export default Dashboard
