import { Event } from '@/db/events'
import prisma from '@/db/prisma'
import Link from 'next/link'

interface Props {
  event: Event
}

const EventEditorNavigation = async ({ event }: Props) => {
  const [prev, next] = await prisma?.$transaction([
    prisma.events.findFirst({ where: { id: event.id - 1 } }),
    prisma.events.findFirst({ where: { id: event.id + 1 } }),
  ])
  return (
    <div className="flex justify-between justify-items-end">
      {prev ? (
        <Link
          href={`/events/${prev.id}/edit`}
          className="text-xs text-primary text-nowrap overflow-hidden text-ellipsis">
          ← {prev.title.slice(0, 20)}...
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/events/${next.id}/edit`}
          className="text-xs text-primary text-nowrap overflow-hidden text-ellipsis">
          {next.title.slice(0, 20)}... →
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}

export default EventEditorNavigation
