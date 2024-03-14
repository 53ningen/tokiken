import { AppleMusicAlbumPreviewPlayer } from '@/components/songs/AppleMusic/AppleMusicAlbumPlayer'
import { listRecordEditionsByRecord } from '@/db/record-editions'
import { Record } from '@/db/records'
import Link from 'next/link'
import RecordEditionDetails from './RecordEditionDetails'

interface Props {
  record: Record
}

const RecordEditions = async ({ record }: Props) => {
  const editions = await listRecordEditionsByRecord(record.id)()
  return (
    <div className="grid gap-4 pt-4">
      <div className="grid gap-1">
        {record.product_url ? (
          <div>
            <Link
              href={record.product_url}
              target="_blank"
              className="inline-block text-lg text-primary font-bold">
              {record.name}
            </Link>
          </div>
        ) : (
          <div className="text-lg text-primary font-bold">{record.name}</div>
        )}
        <div className="text-sm text-gray-500">{record.label}</div>
      </div>
      {record.apple_music_id && (
        <div>
          <AppleMusicAlbumPreviewPlayer appleMusicRecordId={record.apple_music_id} />
        </div>
      )}
      {editions.map((edition) => (
        <RecordEditionDetails key={edition.id} edition={edition} type={record.type} />
      ))}
    </div>
  )
}

export default RecordEditions
