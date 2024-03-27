import { Event, listEventArticles } from '@/db/events'
import SectionHeading from '../commons/SectionHeading'
import EventArticleListItem from './EventArticleListItem'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventArticleList = async ({ event, showHeading = false }: Props) => {
  const articles = await listEventArticles(event.id)()
  return (
    <>
      {articles.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="📝 関連記事・URL" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {articles.map((article) => (
              <EventArticleListItem key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default EventArticleList
