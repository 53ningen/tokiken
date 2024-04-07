'use server'

import { Event, EventType, eventTag, eventsTag } from '@/db/events'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'

interface State {
  event?: Event
  error?: string
}

export const eventEditorAction = async (state: State, data: FormData): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { ...state, error: Errors.NeedAssociatePermission.message }
  }

  const d = extractData(data)
  if (!d) {
    return { ...state, error: Errors.InvalidRequest.message }
  } else if (d.id) {
    const newState = await updateEvent(state, d as Event)
    newState.event && revalidate(newState.event)
    return newState
  } else {
    const newState = await createEvent(state, d as Event)
    newState.event && revalidate(newState.event)
    return newState
  }
}

const updateEvent = async (state: State, e: Event): Promise<State> => {
  try {
    const params = { data: e, where: { id: e.id } }
    const event = await executeQueryWithLogging(
      prisma.events.update(params),
      'events.update',
      params
    )
    return { event, error: undefined }
  } catch (e) {
    console.error(e)
    return { ...state, error: Errors.DatabaseError.message }
  }
}

const createEvent = async (state: State, data: Omit<Event, 'id'>): Promise<State> => {
  try {
    const { title, type, date, start, place_id, note } = data
    const params = {
      data: {
        title,
        type,
        date,
        start,
        place_id,
        note,
      },
    }
    const sameEvents = await prisma.events.findMany({
      where: {
        title,
        date,
        place_id,
      },
    })
    if (sameEvents.length > 0) {
      return { ...state, error: Errors.AlreadyExists.message }
    }
    const event = await executeQueryWithLogging(
      prisma.events.create(params),
      'events.create',
      params
    )
    return { event, error: undefined }
  } catch (e) {
    console.error(e)
    return { ...state, error: Errors.DatabaseError.message }
  }
}

const extractData = (data: FormData) => {
  const id = parseInt(data.get('id') as string)
  const title = data.get('title') as string
  const type = data.get('type') as EventType
  const hashtags = data.get('hashtags') as string
  const date = data.get('date') as string
  const start = data.get('start') as string
  const place_id = parseInt(data.get('place_id') as string)
  const note = data.get('note') as string
  if (!title || !type || !date) {
    return undefined
  }
  return {
    id: isNaN(id) ? null : id,
    title,
    type,
    hashtags: hashtags === '' ? null : hashtags,
    date,
    start: start === '' ? null : start,
    place_id: isNaN(place_id) ? null : place_id,
    note: note === '' ? null : note,
  }
}

const revalidate = (event: Event) => {
  const dt = new Date(event.date)
  revalidateTag(eventsTag(dt.getFullYear(), dt.getMonth() + 1))
  revalidateTag(eventTag(event.id))
}
