import Articles from './[yyyymm]/page'

export const revalidate = 60

const ArticleBastion = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const yyyymm = `${year}${month.toString().padStart(2, '0')}`
  return Articles({ params: { yyyymm } })
}

export default ArticleBastion
