import { noImageUrl } from '@/consts/metadata'
import { Article } from '@/db/articles'

interface Props {
  article: Article
}

const EventArticleListItem = ({ article }: Props) => {
  return (
    <a href={article.url} target="_blank" rel="noopener" className="block border rounded">
      <div className="flex gap-1 text-sm text-gray-500">
        <img
          src={article.thumbnail_url || noImageUrl}
          alt={article.title}
          className="w-16 h-16 aspect-square object-cover rounded-l"
        />
        <div className="flex flex-col p-1 h-16 overflow-hidden">
          <div className="h-12 font-bold overflow-hidden">{article.title}</div>
          <div className="text-xs">{article.published_at}</div>
        </div>
      </div>
    </a>
  )
}

export default EventArticleListItem
