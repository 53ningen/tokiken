import { Article } from '@/db/articles'
import ArticleListItem from './ArticleListItem'

interface Props {
  articles: Article[]
}
const ArticleList = ({ articles }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
      {articles.map((article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </div>
  )
}

export default ArticleList
