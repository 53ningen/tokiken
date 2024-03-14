import { listRecordEditionsBySong } from '@/db/record-editions'
import { Song } from '@/db/songs'
import { dateToYYYYMMDD } from '@/utils/datetime'

interface Props {
  song: Song
}

const SongMetadata = async ({ song }: Props) => {
  const { kana, title, jasrac_code, iswc_code } = song
  const firstAppearanceEdition = (await listRecordEditionsBySong(song.id)())[0]
  return (
    <div className="py-4">
      <div className="text-xs text-gray-500">{kana}</div>
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      {firstAppearanceEdition && (
        <div className="text-xs text-gray-500">
          リリース日: {dateToYYYYMMDD(new Date(firstAppearanceEdition.release_date))}
        </div>
      )}
      {firstAppearanceEdition && (
        <div className="text-xs text-gray-500">
          初出: {firstAppearanceEdition.records.name}（{firstAppearanceEdition.name}）
        </div>
      )}
      {jasrac_code && (
        <div className="text-xs text-gray-500">JASRAC 作品コード: {jasrac_code}</div>
      )}
      {iswc_code && (
        <div className="text-xs text-gray-500">ISWC 作品コード: {iswc_code}</div>
      )}
    </div>
  )
}

export default SongMetadata
