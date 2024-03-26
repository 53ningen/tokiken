import { Event } from '@/db/events'
import SectionHeading from '../commons/SectionHeading'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventBlogList = async ({ event, showHeading = false }: Props) => {
  const blogs = []
  return (
    <>
      {blogs.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="📝 関連ブログ" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"></div>
        </div>
      )}
    </>
  )
}

export default EventBlogList
