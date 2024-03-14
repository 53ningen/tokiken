import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import RecordEditions from '@/components/records/RecordEditionDetails/RecordEditions'
import { getRecordBySlug } from '@/db/records'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata | null> => {
  const slug = decodeURIComponent(params.slug)
  const record = await getRecordBySlug(slug)()
  if (!record) {
    return null
  } else {
    const title = `${record.name} - 超ときめき♡レコードデータベース`
    const description = `超ときめき♡宣伝部のレコード: ${record.name} のデータ`
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

export const generateStaticParams = async () => {
  return []
}

const Record = async ({ params }: Props) => {
  const slug = decodeURIComponent(params.slug)
  const record = await getRecordBySlug(slug)()
  if (!record) {
    notFound()
  }
  return (
    <Container className="max-w-screen-lg px-2 py-4">
      <Breadcrumbs items={[{ name: 'レコードデータベース', href: '/records' }]} />
      <RecordEditions record={record} />
    </Container>
  )
}

export default Record
