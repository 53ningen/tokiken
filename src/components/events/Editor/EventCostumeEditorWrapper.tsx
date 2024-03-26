'use server'

import { listCostumes } from '@/db/costumes'
import { Event, EventCostume, eventCostumesTag, listEventCostumes } from '@/db/events'
import prisma from '@/db/prisma'
import {
  AuthGetCurrentUserServer,
  isAdminUserServer,
  isAssociateUserServer,
} from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { revalidateTag } from 'next/cache'
import EventCostumeEditor from './EventCostumeEditor'

interface Props {
  event: Event
}
export const EventCostumeEditorWrapper = async ({ event }: Props) => {
  const costumes = await listCostumes()
  const eventCostumes = await listEventCostumes(event.id)()
  return (
    <EventCostumeEditor
      event={event}
      eventCostumes={eventCostumes}
      allCostumes={costumes}
    />
  )
}

export async function addEventCostume(
  data: FormData
): Promise<Either<string, EventCostume>> {
  if (!(await isAssociateUserServer())) {
    return left('Unauthorized')
  }

  const event_id = parseInt(data.get('event_id') as string)
  const costume_id = parseInt(data.get('costume_id') as string)
  const display_order = parseInt(data.get('display_order') as string)
  if (isNaN(event_id) || isNaN(costume_id) || isNaN(display_order)) {
    return left('invalid event_id, costume_id, or display_order')
  }
  try {
    const exists = await prisma.event_cosutumes.findFirst({
      where: {
        event_id,
        costume_id,
      },
    })
    if (exists) {
      return left('The costume has already been added to the event.')
    }
    const res = await prisma.event_cosutumes.create({
      data: {
        event_id,
        costume_id,
        display_order,
      },
    })
    revalidateTag(eventCostumesTag(event_id))
    return right(res)
  } catch (e) {
    console.error(e)
    return left('Internal Server Error')
  }
}

export const deleteEventCostume = async (
  eventCostumeId: number
): Promise<Either<string, EventCostume>> => {
  if (!(await isAdminUserServer())) {
    return left('Administrator permission required, please contact with @kusabure.')
  }

  try {
    const eventCostume = await prisma.event_cosutumes.delete({
      where: {
        id: eventCostumeId,
      },
    })
    revalidateTag(eventCostumesTag(eventCostume.event_id))
    return right(eventCostume)
  } catch (e) {
    console.error(e)
    return left('Internal Server Error')
  }
}

export const updateEventCostume = async (
  data: FormData
): Promise<Either<string, EventCostume>> => {
  const authenticated = await AuthGetCurrentUserServer()
  if (!authenticated) {
    return left('Unauthorized')
  }

  const id = parseInt(data.get('event_costume_id') as string)
  const display_order = parseInt(data.get('display_order') as string)
  if (isNaN(id) || isNaN(display_order)) {
    return left('invalid event_costume_id or display_order')
  }
  try {
    const eventCostume = await prisma.event_cosutumes.update({
      where: {
        id,
      },
      data: {
        display_order,
      },
    })
    revalidateTag(eventCostumesTag(eventCostume.event_id))
    return right(eventCostume)
  } catch (e) {
    console.error(e)
    return left('Internal Server Error')
  }
}
