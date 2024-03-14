import Link from 'next/link'

interface Props {
  date: Date
}

const CalendarCellDate = ({ date }: Props) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const color = (() => {
    switch (date.getDay()) {
      case 0:
        return 'text-red-500'
      case 6:
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  })()
  return (
    <Link id={day.toString()} href={`#${day}`} className={`min-w-10 ${color}`}>
      {month}/{day}
    </Link>
  )
}

export default CalendarCellDate
