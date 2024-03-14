import { listAnnualEvents } from '@/db/annual-events'
import { listBlogs } from '@/db/blogs'
import { listEvents } from '@/db/events'
import CalendarBody from './CalendarBody'

interface Props {
  year: number
  month: number
}

const Calendar = async ({ year, month }: Props) => {
  const events = await listEvents(year, month)()
  const annualEvents = await listAnnualEvents(year, month)()
  const blogs = await listBlogs(year, month)()
  return (
    <CalendarBody
      year={year}
      month={month}
      events={events}
      annualEvents={annualEvents}
      blogs={blogs}
    />
  )
}

export default Calendar
