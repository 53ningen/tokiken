import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import CalendarDateDropdown from './CalendarDateDropdown'

interface Props {
  date: Date
}

const CalendarNavigation = ({ date }: Props) => {
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 0)
  const lastMonthYYYY = lastMonth.getFullYear()
  const lastMonthMM = (lastMonth.getMonth() + 1).toString().padStart(2, '0')
  const showLastMonth =
    lastMonthYYYY > 2015 || (lastMonthYYYY === 2015 && lastMonth.getMonth() > 2)
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  const nextMonthYYYY = nextMonth.getFullYear()
  const nextMonthMM = (nextMonth.getMonth() + 1).toString().padStart(2, '0')
  return (
    <div className="flex justify-between py-8 text-sm text-primary font-bold">
      {showLastMonth ? (
        <Link
          href={`/calendar/${lastMonthYYYY}${lastMonthMM}`}
          prefetch={false}
          className="flex gap-1">
          <ChevronLeftIcon className="h-5 w-5" />
          {`${lastMonthYYYY}/${lastMonthMM}`}
        </Link>
      ) : (
        <div />
      )}
      <CalendarDateDropdown date={date} />
      <Link
        href={`/calendar/${nextMonthYYYY}${nextMonthMM}`}
        prefetch={false}
        className="flex">
        {`${nextMonthYYYY}/${nextMonthMM}`}
        <ChevronRightIcon className="h-5 w-5" />
      </Link>
    </div>
  )
}

export default CalendarNavigation
