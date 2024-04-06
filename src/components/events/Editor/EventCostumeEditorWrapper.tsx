'use server'

import { listCostumes } from '@/db/costumes'
import { Event, EventCostume, eventCostumesTag, listEventCostumes } from '@/db/events'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
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

interface State {
  error?: string
  costume?: EventCostume
}
export const eventCostumeEditorAction = async (
  _: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }

  const action = data.get('action') as string
  if (action === 'insert') {
    const res = await insertCostume(data)
    return res
  }

  const del = action.match(/delete:(\d+)/)
  const delId = parseInt(del ? del[1] : '')
  if (!isNaN(delId)) {
    const res = await deleteEventCostume(delId)
    return res
  }

  const update = action.match(/update:(\d+)/)
  const updateId = parseInt(update ? update[1] : '')
  if (!isNaN(updateId)) {
    const display_order = parseInt(data.get(`display_order[${updateId}]`) as string)
    if (isNaN(display_order)) {
      return { error: Errors.InvalidRequest.message }
    }
    const res = await updateEventCostume(updateId, display_order)
    return res
  }

  return { error: Errors.InvalidRequest.message }
}

const insertCostume = async (data: FormData): Promise<State> => {
  const event_id = parseInt(data.get('event_id') as string)
  const costume_id = parseInt(data.get('costume_id') as string)
  const display_order = parseInt(data.get('display_order') as string)
  if (isNaN(event_id) || isNaN(costume_id) || isNaN(display_order)) {
    return { error: Errors.InvalidRequest.message }
  }

  try {
    const exists = await prisma.event_cosutumes.findFirst({
      where: {
        event_id,
        costume_id,
      },
    })
    if (exists) {
      return { error: Errors.AlreadyExists.message }
    }

    const params = {
      data: {
        event_id,
        costume_id,
        display_order,
      },
    }
    const res = await executeQueryWithLogging(
      prisma.event_cosutumes.create(params),
      'event_cosutumes.create',
      params
    )
    revalidateTag(eventCostumesTag(event_id))
    return { costume: res }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}

export const deleteEventCostume = async (eventCostumeId: number): Promise<State> => {
  try {
    const params = {
      where: {
        id: eventCostumeId,
      },
    }
    const eventCostume = await executeQueryWithLogging(
      prisma.event_cosutumes.delete(params),
      'event_cosutumes.delete',
      params
    )
    revalidateTag(eventCostumesTag(eventCostume.event_id))
    return { costume: eventCostume }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}

export const updateEventCostume = async (
  eventCostumeId: number,
  display_order: number
): Promise<State> => {
  try {
    const params = {
      where: {
        id: eventCostumeId,
      },
      data: {
        display_order,
      },
    }
    const eventCostume = await executeQueryWithLogging(
      prisma.event_cosutumes.update(params),
      'event_cosutumes.update',
      params
    )
    revalidateTag(eventCostumesTag(eventCostume.event_id))
    return { costume: eventCostume }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}
