import { Event } from '@/db/events'

interface Props {
  event: Event
}

const EventNote = ({ event }: Props) => {
  return (
    <>
      {event.note && <pre className="py-2 whitespace-pre-wrap text-xs">{event.note}</pre>}
    </>
  )
}

export default EventNote
