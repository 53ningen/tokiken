'use server'

import { Event, EventType, listEventPlaces } from '@/db/events'
import prisma from '@/db/prisma'
import { isAdminUserServer, isAssociateUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { revalidateTag } from 'next/cache'
import EventEditor from './EventEditor'

interface Props {
  event?: Event
}

export const EventEditorWrapper = async ({ event }: Props) => {
  const places = await listEventPlaces()
  return <EventEditor event={event} places={places} />
}

export const createEvent = async (data: FormData): Promise<Either<string, Event>> => {
  if (!(await isAdminUserServer())) {
    return left('Administrator permission required, please contact with @kusabure.')
  }

  const title = data.get('title') as string
  const type = data.get('type') as EventType
  const date = data.get('date') as string
  const start = data.get('start') as string | undefined
  const rawPlaceId = parseInt(data.get('place_id') as string)
  const place_id = isNaN(rawPlaceId) ? undefined : rawPlaceId
  if (!title || !type || !date) {
    return left('invalid data')
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
      return left(`event already exists: ${title}`)
    }
    const event = await prisma.events.create({
      data: {
        title,
        type,
        date,
        start,
        place_id,
      },
    })
    const yyyymm = new Date(date).toISOString().slice(0, 7)
    revalidateTag(`events-${yyyymm}`)
    return right(event)
  } catch (e) {
    console.log(e)
    return left(`create failed`)
  }
}

export const updateEvent = async (data: FormData): Promise<Either<string, Event>> => {
  if (!(await isAssociateUserServer())) {
    return left('Unauthorized')
  }

  const id = parseInt(data.get('id') as string)
  const title = data.get('title') as string
  const type = data.get('type') as EventType
  const date = data.get('date') as string
  const start = data.get('start') as string | undefined
  const rawPlaceId = parseInt(data.get('place_id') as string)
  const place_id = isNaN(rawPlaceId) ? undefined : rawPlaceId
  if (isNaN(id) || !title || !type || !date) {
    return left('invalid data')
  }
  try {
    const event = await prisma.events.update({
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
    })
    const yyyymm = new Date(date).toISOString().slice(0, 7)
    revalidateTag(`events-${yyyymm}`)
    revalidateTag(`event-${id}`)
    return right(event)
  } catch (e) {
    console.log(e)
    return left(`create failed`)
  }
}
