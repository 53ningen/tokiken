import { AnnualEvent } from '@/db/annual-events'
import { Blog } from '@/db/blogs'
import { Event } from '@/db/events'
import CalendarCellAnnualEvent from './CalendarCellAnnualEvent'
import CalendarCellBlog from './CalendarCellBlog'
import CalendarCellDate from './CalendarCellDate'
import CalendarCellEvent from './CalendarCellEvent'
import TweetsLink from './TweetsLink'

interface Props {
  date: Date
  events: Event[]
  annualEvents: AnnualEvent[]
  blogs: Blog[]
  showBlogTitles: boolean
}

const CalendarCell = ({ date, events, annualEvents, blogs, showBlogTitles }: Props) => {
  return (
    <div>
      <div className="flex gap-2 items-start text-sm text-left">
        <CalendarCellDate date={date} />
        <TweetsLink date={date} screenName="sendenbu_staff" color="orange" />
        <TweetsLink date={date} screenName="julia_an115" color="purple" />
        <div className="grid gap-2 w-full">
          {annualEvents.map((event, i) => (
            <CalendarCellAnnualEvent key={i} event={event} />
          ))}
          {events.map((event, i) => (
            <CalendarCellEvent key={i} event={event} />
          ))}
          {blogs.length > 0 && (
            <div className="flex pt-1 pl-2 text-gray-400">
              <div>
                {!showBlogTitles && <span className="mr-1">📘</span>}
                {blogs.map((blog, i) => (
                  <CalendarCellBlog key={i} blog={blog} showBlogTitles={showBlogTitles} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <hr className="mt-4" />
    </div>
  )
}

export default CalendarCell
