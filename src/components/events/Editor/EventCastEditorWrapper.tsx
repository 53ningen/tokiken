'use server'

import { Event, EventCast, eventCastsTag, listEventCasts } from '@/db/events'
import { executeQueriesWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import EventCastEditor from './EventCastEditor'

interface Props {
  event: Event
}

const EventCastEditorWrapper = async ({ event }: Props) => {
  const casts = await listEventCasts(event.id)()
  return <EventCastEditor event={event} casts={casts} />
}

export default EventCastEditorWrapper

interface State {
  error?: string
  casts?: EventCast[]
}

export const eventCastEditorAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { error: Errors.NeedAssociatePermission.message }
  }

  const event_id = parseInt(data.get('event_id') as string)
  const membersRaw = data.get('regime_members') as string
  const action = data.get('action') as string
  if (isNaN(event_id) || !action || !membersRaw) {
    return { error: Errors.InvalidRequest.message }
  }

  const members = membersRaw.split(',')
  if (action === 'update') {
    const res = await updateCasts(data, members)
    return res
  }

  if (action === 'insert_all') {
    const res = await insertEventCasts(event_id, ...members)
    return res
  }
  return state
}

const updateCasts = async (data: FormData, members: string[]): Promise<State> => {
  const eventId = Number(data.get('event_id'))
  try {
    const currentCasts = await listEventCasts(eventId)()

    // DB に存在しているが、チェックボックスにチェックが入っていないキャストを抽出
    const toBeDeleted: string[] = []
    for (const cast of currentCasts) {
      const checked = data.get(encodeURIComponent(cast.name))
      if (!checked) {
        toBeDeleted.push(cast.name)
      }
    }
    await deleteEventCasts(eventId, ...toBeDeleted)

    // チェックボックスにチェックが入っているが、DBに存在しないキャストを抽出
    const toBeAdded = members.filter((name) => {
      const checked = data.get(encodeURIComponent(name)) !== undefined
      return checked && !currentCasts.find((cast) => cast.name === name)
    })
    await insertEventCasts(eventId, ...toBeAdded)
    const newCasts = await listEventCasts(eventId)()
    return { casts: newCasts }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}

const insertEventCasts = async (eventId: number, ...names: string[]): Promise<State> => {
  if (names.length === 0) {
    return { casts: [] }
  }
  try {
    const params = names.map((name) => {
      return {
        where: {
          id: `${eventId}/${name}`,
        },
        create: {
          id: `${eventId}/${name}`,
          event_id: eventId,
          name: name,
        },
        update: {},
      }
    })
    const promises = params.map((p) => prisma.event_casts.upsert(p))
    const res = await executeQueriesWithLogging(
      promises,
      'event_casts.bulk_upsert',
      params
    )
    revalidateTag(eventCastsTag(eventId))
    return { casts: res }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}

const deleteEventCasts = async (eventId: number, ...names: string[]): Promise<State> => {
  if (names.length === 0) {
    return { casts: [] }
  }
  try {
    const params = names.map((name) => {
      return {
        where: {
          id: `${eventId}/${name}`,
        },
      }
    })
    await executeQueriesWithLogging(
      params.map((p) => prisma.event_casts.delete(p)),
      'event_casts.bulk_delete',
      params
    )
    revalidateTag(eventCastsTag(eventId))
    return { casts: [] }
  } catch (e) {
    console.error(e)
    return { error: Errors.DatabaseError.message }
  }
}
