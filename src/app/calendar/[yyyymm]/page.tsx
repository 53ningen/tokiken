import Breadcrumbs from '@/components/commons/Breadcrumbs/Breadcrumbs'
import Container from '@/components/commons/Container'
import Title from '@/components/commons/Title'
import Calendar from '@/components/events/Calendar/Calendar'
import { notFound } from 'next/navigation'

interface Props {
  params: { yyyymm: string }
}

export const generateStaticParams = async () => {
  return []
}

const CalendarPage = async ({ params }: Props) => {
  if (params.yyyymm.length !== 6) {
    notFound()
  }

  const yyyymm = parseInt(params.yyyymm)
  if (isNaN(yyyymm) || yyyymm < 1) {
    notFound()
  }

  const year = Math.floor(yyyymm / 100)
  const month = yyyymm % 100
  const isValidDate = 201504 <= yyyymm && yyyymm <= 203512 && 1 <= month && month <= 12
  if (!isValidDate) {
    notFound()
  }
  return (
    <Container className="max-w-screen-lg text-center px-2 md:px-2 py-4">
      <Breadcrumbs items={[{ name: '超ときめき♡カレンダー', href: '/calendar' }]} />
      <Title
        title={`${year}年${month}月のカレンダー`}
        description="超ときめき♡宣伝部のカレンダー"
      />
      <Calendar year={year} month={month} />
    </Container>
  )
}

export default CalendarPage
