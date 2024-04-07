'use server'

import { Event, EventType, listEventPlaces } from '@/db/events'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import EventEditor from './EventEditor'

interface Props {
  event?: Event
}

export const EventEditorWrapper = async ({ event }: Props) => {
  const places = await listEventPlaces()
  return <EventEditor event={event} places={places} />
}

interface State {
  error?: string
  event?: Event
}

export const eventEditorAction = async (_: State, data: FormData): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }

  const action = data.get('action') as string
  if (action === 'insert') {
    createEvent(data)
  }
  if (action === 'update') {
    updateEvent(data)
  }
  return { error: Errors.InvalidRequest.message }
}

export const createEvent = async (data: FormData): Promise<State> => {
  const title = data.get('title') as string
  const type = data.get('type') as EventType
  const date = data.get('date') as string
  const start = data.get('start') as string | undefined
  const rawPlaceId = parseInt(data.get('place_id') as string)
  const place_id = isNaN(rawPlaceId) ? undefined : rawPlaceId
  if (!title || !type || !date) {
    return { error: Errors.InvalidRequest.message }
  }
  try {
    const exists = await prisma.events.findFirst({
      where: {
        title,
        date,
        start,
      },
    })
    if (exists) {
      return { error: Errors.AlreadyExists.message }
    }
    const params = {
      data: {
        title,
        type,
        date,
        start,
        place_id,
      },
    }
    const event = await executeQueryWithLogging(
      prisma.events.create(params),
      'events.create',
      params
    )
    const yyyymm = new Date(date).toISOString().slice(0, 7)
    revalidateTag(`events-${yyyymm}`)
    return { event }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}

export const updateEvent = async (data: FormData): Promise<State> => {
  const id = parseInt(data.get('id') as string)
  const title = data.get('title') as string
  const type = data.get('type') as EventType
  const date = data.get('date') as string
  const start = data.get('start') as string | undefined
  const rawPlaceId = parseInt(data.get('place_id') as string)
  const place_id = isNaN(rawPlaceId) ? undefined : rawPlaceId
  if (isNaN(id) || !title || !type || !date) {
    return { error: Errors.InvalidRequest.message }
  }
  try {
    const params = {
      data: {
        title,
        type,
        date,
        start,
        place_id,
      },
      where: {
        id,
      },
    }
    const event = await executeQueryWithLogging(
      prisma.events.update(params),
      'events.update',
      params
    )
    const yyyymm = new Date(date).toISOString().slice(0, 7)
    revalidateTag(`events-${yyyymm}`)
    revalidateTag(`event-${id}`)
    return { event }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}
