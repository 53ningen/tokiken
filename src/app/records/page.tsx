import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Title from '@/components/commons/Title'
import IndexedRecordEditions from '@/components/records/RecordEditionCollection/IndexedRecordEditions'
import { Metadata } from 'next'

const title = '超ときめき♡レコードデータベース'
const description = '超ときめき♡宣伝部のレコードのデータ'

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

const Records = () => {
  return (
    <Container className="max-w-screen-lg text-center px-2 py-4">
      <Breadcrumbs items={[{ name: 'レコードデータベース', href: '/records' }]} />
      <Title title={title} description={description} />
      <IndexedRecordEditions />
    </Container>
  )
}

export default Records
