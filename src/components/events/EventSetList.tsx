import { Event, getSetlistCredit, listEventSetlist } from '@/db/events'
import Link from 'next/link'
import SectionHeading from '../commons/SectionHeading'
import EventSetlistItem from './EventSetlistItem'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventSetList = async ({ event, showHeading = false }: Props) => {
  const [setlist, credit] = await Promise.all([
    listEventSetlist(event.id)(),
    getSetlistCredit(event.id)(),
  ])
  return (
    <div className="flex flex-col gap-2">
      {setlist.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="🎵 セットリスト" />}
          {setlist.map((set) => (
            <EventSetlistItem key={set.id} item={set} />
          ))}
        </div>
      )}
      {credit && (
        <div className="text-sm text-gray-500">
          セットリスト出典:{' '}
          <Link
            href={credit.source_url}
            className="text-primary"
            target="_blank"
            rel="noopener noreferrer">
            {credit.name}
          </Link>
        </div>
      )}
    </div>
  )
}

export default EventSetList
