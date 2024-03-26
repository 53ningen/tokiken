import { Event } from '@/db/events'
import SectionHeading from '../commons/SectionHeading'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventArticleList = async ({ event, showHeading = false }: Props) => {
  const articles = []
  return (
    <>
      {articles.length > 0 && (
        <>
          {showHeading && <SectionHeading title="📝 関連記事・URL" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"></div>
        </>
      )}
    </>
  )
}

export default EventArticleList
