import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import SectionHeading from '@/components/commons/SectionHeading'
import Title from '@/components/commons/Title'

interface Props {}

const Contents = ({}: Props) => {
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: 'コンテンツデータベース', href: '/contents' }]} />
      <Title
        title="超ときめき♡コンテンツデータベース"
        description="超ときめき♡宣伝部のコンテンツのデータ"
      />
      <SectionHeading title="🎬 YouTube" />
      <SectionHeading title="📓 ブログ" />
      <SectionHeading title="📝 ニュース記事" />
    </Container>
  )
}

export default Contents
