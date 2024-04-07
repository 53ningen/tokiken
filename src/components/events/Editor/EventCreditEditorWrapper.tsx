'use server'

import { listArtists } from '@/db/artists'
import { Event, EventCredit, eventCreditsTag, listEventCredits } from '@/db/events'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import EventCreditEditor from './EventCreditEditor'

interface Props {
  event: Event
}

const EventCreditEditorWrapper = async ({ event }: Props) => {
  const [artists, credits] = await Promise.all([
    listArtists(),
    listEventCredits(event.id)(),
  ])
  return <EventCreditEditor event={event} artists={artists} credits={credits} />
}

export default EventCreditEditorWrapper

interface State {
  credits: EventCredit[]
  error?: string
}

export const updateCredit = async (state: State, data: FormData): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { ...state, error: Errors.NeedAssociatePermission.message }
  }

  const event_id = parseInt(data.get('event_id') as string)
  const action = data.get('action') as string
  if (isNaN(event_id) || !action) {
    return { ...state, error: Errors.InvalidRequest.message }
  }

  // 削除アクション
  const del = action.match(/delete:(\d+)/)
  const delIndex = parseInt(del ? del[1] : '')
  if (!isNaN(delIndex)) {
    const res = deleteRow(state, data, event_id, delIndex)
    return res
  }

  // 行の更新・追加アクション
  const update = action.match(/update:(\d+)/)
  const updateIndex = parseInt(update ? update[1] : '')
  if (!isNaN(updateIndex) && updateIndex >= 0) {
    const res = await updateRow(state, data, event_id, updateIndex)
    return res
  }

  return { ...state, error: Errors.InvalidRequest.message }
}

const extractRowData = async (data: FormData, i: number) => {
  const id = parseInt(data.get(`id[${i}]`) as string)
  const display_order = parseInt(data.get(`display_order[${i}]`) as string)
  const artist_id = parseInt(data.get(`artist_id[${i}]`) as string)
  const title = data.get(`title[${i}]`) as string
  const name = data.get(`name[${i}]`) as string
  const source_url = data.get(`source_url[${i}]`) as string
  if (
    isNaN(id) ||
    isNaN(display_order) ||
    isNaN(artist_id) ||
    !title ||
    title === '' ||
    !source_url ||
    source_url === ''
  ) {
    return undefined
  } else {
    return {
      id,
      display_order,
      artist_id,
      title,
      name: name === '' ? null : name,
      source_url,
    }
  }
}

const updateRow = async (
  state: State,
  data: FormData,
  event_id: number,
  index: number
) => {
  const row = await extractRowData(data, index)
  if (!row) {
    return { ...state, error: Errors.InvalidRequest.message }
  } else {
    try {
      if (row.id < 0) {
        const params = {
          data: {
            event_id,
            display_order: row.display_order,
            artist_id: row.artist_id,
            title: row.title,
            name: row.name,
            source_url: row.source_url,
          },
        }
        const res = await executeQueryWithLogging(
          prisma.event_credits.create(params),
          'event_credits.create',
          params
        )
        revalidateTag(eventCreditsTag(event_id))
        return {
          credits: [
            ...state.credits.slice(0, index),
            res,
            {
              id: -1 * (state.credits.length + 1),
              display_order: state.credits.length + 1,
              artist_id: -1,
              title: '',
              name: null,
              source_url: '',
            } as EventCredit,
          ],
          error: undefined,
        }
      } else {
        const params = {
          where: { id: row.id },
          data: {
            event_id,
            display_order: row.display_order,
            artist_id: row.artist_id,
            title: row.title,
            name: row.name,
            source_url: row.source_url,
          },
        }
        const res = await executeQueryWithLogging(
          prisma.event_credits.update(params),
          'event_credits.update',
          params
        )
        revalidateTag(eventCreditsTag(event_id))
        return {
          credits: [
            ...state.credits.slice(0, index),
            res,
            ...state.credits.slice(index + 1),
          ],
          error: undefined,
        }
      }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }
}

const deleteRow = async (
  state: State,
  data: FormData,
  event_id: number,
  index: number
) => {
  const row = await extractRowData(data, index)
  if (!row) {
    return { ...state, error: Errors.InvalidRequest.message }
  } else {
    try {
      if (row.id > 0) {
        const params = { where: { id: row.id } }
        await executeQueryWithLogging(
          prisma.event_credits.delete(params),
          'event_credits.delete',
          params
        )
        revalidateTag(eventCreditsTag(event_id))
      }
      return {
        credits: state.credits.filter((c) => c.id !== row.id),
        error: undefined,
      }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }
}
