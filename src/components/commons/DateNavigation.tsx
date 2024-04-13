import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import DateDropdown from './DateDropdown'

interface Props {
  since: Date
  date: Date
  path: string
}

const DateNavigation = ({ since, date, path }: Props) => {
  const lastMonth = new Date(date.getFullYear(), date.getMonth(), 0)
  const showLastMonth =
    lastMonth.getFullYear() > 2015 ||
    (lastMonth.getFullYear() === 2015 && lastMonth.getMonth() > 2)
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  return (
    <div className="flex justify-between py-8 text-sm text-primary font-bold">
      {showLastMonth ? (
        <Link
          href={`${path}/${lastMonth.getFullYear()}${(lastMonth.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`}
          prefetch={false}
          className="flex gap-1">
          <ChevronLeftIcon className="h-5 w-5" />
          {`${lastMonth.getFullYear()}/${lastMonth.getMonth() + 1}`}
        </Link>
      ) : (
        <div />
      )}
      <DateDropdown since={since} date={date} path={path} />
      <Link
        href={`${path}/${nextMonth.getFullYear()}${(nextMonth.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`}
        prefetch={false}
        className="flex">
        {`${nextMonth.getFullYear()}/${nextMonth.getMonth() + 1}`}
        <ChevronRightIcon className="h-5 w-5" />
      </Link>
    </div>
  )
}

export default DateNavigation
