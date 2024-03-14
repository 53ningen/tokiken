import Tooltip from '@/components/commons/Tooltip'
import { Blog } from '@/db/blogs'
import Link from 'next/link'

interface Props {
  blog: Blog
  showBlogTitles: boolean
}

const CalendarCellBlog = ({ blog, showBlogTitles }: Props) => {
  if (showBlogTitles) {
    return (
      <div>
        <Link href={blog.url} target="_blank" className="mr-1 select-none">
          📄 {blog.title}
        </Link>
      </div>
    )
  } else {
    const label = (() => {
      switch (blog.author) {
        case 'kanami':
          return 'かなみ'
        case 'julia':
          return 'ジュリア'
        case 'hitoka':
          return 'ひとか'
        case 'haruka':
          return 'はるか'
        case 'aki':
          return 'あき'
        case 'hiyori':
          return 'ひより'
        case 'kumicho':
          return 'くみちょう'
        case 'banbi':
          return 'ばんび'
        case 'mako':
          return 'まこ'
        case 'sara':
          return 'サラ'
        default:
          return '📙'
      }
    })()
    return (
      <Tooltip text={blog.title} tipPosition="bottom">
        <Link
          href={blog.url}
          target="_blank"
          className="mr-1 leading-3 text-nowrap select-none">
          <span>{label}</span>
        </Link>
      </Tooltip>
    )
  }
}

export default CalendarCellBlog
