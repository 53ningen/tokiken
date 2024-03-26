import { Event, listEventSetlist } from '@/db/events'
import SectionHeading from '../commons/SectionHeading'
import EventSetlistItem from './EventSetlistItem'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventSetList = async ({ event, showHeading = false }: Props) => {
  const setlist = await listEventSetlist(event.id)()
  return (
    <>
      {setlist.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="🎵 セットリスト" />}
          {setlist.map((set) => (
            <EventSetlistItem key={set.id} item={set} />
          ))}
        </div>
      )}
    </>
  )
}

export default EventSetList
