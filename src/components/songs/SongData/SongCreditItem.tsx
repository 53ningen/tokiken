import { SongCredit } from '@/db/songs'
import {
  AdjustmentsVerticalIcon,
  DocumentTextIcon,
  MicrophoneIcon,
  MusicalNoteIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid'
import Link from 'next/link'

interface Props {
  credit: SongCredit
}

const SongCreditItem = ({ credit }: Props) => {
  const title = getTitle(credit)
  const sourceLabel = getSourceLabel(credit)
  const icon = getIcon(credit)
  return (
    <div
      key={credit.id}
      className="p-2 lg:px-4 bg-white rounded-lg border overflow-hidden text-left">
      <div className="flex">
        <div className="flex justify-center pr-2 lg:pr-4">{icon}</div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="pb-1 font-semibold">
            <Link href={`/artists/${credit.artist_id}`} className="text-primary">
              {credit.name}
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            {credit.source_url ? (
              <Link href={credit.source_url} className="text-primary">
                {sourceLabel}
              </Link>
            ) : (
              sourceLabel
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const getTitle = (credit: SongCredit) => {
  switch (credit.role) {
    case 'Lyrics':
      return '作詞'
    case 'Music':
      return '作曲'
    case 'Arrangement':
      return '編曲'
    case 'Vocal':
      return '歌唱'
    case 'Dance':
      return 'ダンス'
    case 'Produce':
    default:
      return credit.title || '制作'
  }
}

const getSourceLabel = (credit: SongCredit) => {
  switch (credit.source) {
    case 'BOOKLET':
      return '✅ ブックレット記載情報'
    case 'JASRAC':
      return '✅ JASRAC 登録情報'
    case 'EXTERNAL':
      return '✅ ウェブ記載情報'
    default:
      return '🎵 情報確認中'
  }
}

const getIcon = (credit: SongCredit) => {
  switch (credit.role) {
    case 'Lyrics':
      return (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary">
          <DocumentTextIcon className="h-6 w-6 text-white" />
        </div>
      )
    case 'Music':
      return (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary">
          <MusicalNoteIcon className="h-6 w-6 text-white" />
        </div>
      )
    case 'Arrangement':
      return (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary">
          <AdjustmentsVerticalIcon className="h-6 w-6 text-white" />
        </div>
      )
    case 'Vocal':
      return (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary">
          <MicrophoneIcon className="h-6 w-6 text-white" />
        </div>
      )
    case 'Dance':
      return (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200">
          <UserGroupIcon className="h-6 w-6 text-gray-500" />
        </div>
      )
    case 'Produce':
    default:
      return (
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200">
          <SparklesIcon className="h-6 w-6 text-gray-500" />
        </div>
      )
  }
}

export default SongCreditItem
