import { listRecordEditionsBySong } from '@/db/record-editions'
import RecordEditionItem from './RecordEditionItem'

interface Props {
  songId: number
}

const RecordEditionCollection = async ({ songId }: Props) => {
  const editions = await listRecordEditionsBySong(songId)()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {editions.map((item) => (
        <RecordEditionItem key={item.catalog_number} item={item} />
      ))}
    </div>
  )
}

export default RecordEditionCollection
