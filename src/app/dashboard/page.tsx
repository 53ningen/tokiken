import Container from '@/components/commons/Container'
import LogoutButton from '@/components/commons/LogoutButton'
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
      <div className="flex flex-col gap-8 text-left [&_a]:text-primary">
        <div className="flex flex-col">
          <SectionHeading title="各種データ管理" />
          <Link href="/events/add">🏟️ イベント/イベント会場データ追加</Link>
          <Link href="/youtube/edit">🎬 YouTube データ管理</Link>
        </div>
        <RevalidateTagForm />
        <LogoutButton />
      </div>
    </Container>
  )
}

export default Dashboard
