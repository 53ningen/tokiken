'use server'

import { Event, EventSetlist, eventSetlistTag, listEventSetlist } from '@/db/events'
import { executeQueryWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { listSongs } from '@/db/songs'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import EventSetlistBulkEditorWrapper from './EventSetlistBulkEditorWrapper'
import EventSetlistEditor from './EventSetlistEditor'

interface Props {
  event: Event
}

const EventSetlistEditorWrapper = async ({ event }: Props) => {
  const [songs, setlists] = await Promise.all([listSongs(), listEventSetlist(event.id)()])
  return (
    <div className="flex flex-col gap-4">
      {setlists.length === 0 && <EventSetlistBulkEditorWrapper event={event} />}
      <EventSetlistEditor event={event} songs={songs} setlist={setlists} />
    </div>
  )
}

export default EventSetlistEditorWrapper

interface State {
  setlist: EventSetlist[]
  error?: string
}

export const updateSetlist = async (state: State, data: FormData): Promise<State> => {
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
    return res as State
  }

  return { ...state, error: Errors.InvalidRequest.message }
}

const extractRowData = async (data: FormData, i: number) => {
  const songs = await listSongs()
  const id = parseInt(data.get(`id[${i}]`) as string)
  const order = parseInt(data.get(`order[${i}]`) as string)
  const order_label = data.get(`order_label[${i}]`) as string
  const encore = data.get(`encore[${i}]`) === 'on'
  const song = data.get(`song[${i}]`) as string
  const song_id = songs.find((s) => s.title === song)?.id || null
  if (song && !song_id) {
    return undefined
  }
  const song_title = data.get(`song_title[${i}]`) as string
  if (isNaN(id) || isNaN(order)) {
    return undefined
  } else {
    return {
      id,
      order,
      order_label: order_label === '' ? null : order_label,
      song_id,
      song_title: song_title === '' ? null : song_title,
      encore,
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
            event_id: event_id,
            order: row.order,
            order_label: row.order_label,
            song_id: row.song_id,
            song_title: row.song_title,
            encore: row.encore,
          },
        }
        const res = await executeQueryWithLogging(
          prisma.event_setlist.create(params),
          'event_setlist.create',
          params
        )
        revalidateTag(eventSetlistTag(event_id))
        return {
          setlist: [
            ...state.setlist.slice(0, index),
            res,
            {
              id: -1 * (state.setlist.length + 1),
              event_id,
              order: state.setlist.length + 1,
              song_id: null,
              song_title: null,
              note: null,
            },
          ],
          error: undefined,
        }
      } else {
        const params = {
          where: { id: row.id },
          data: {
            order: row.order,
            order_label: row.order_label,
            song_id: row.song_id,
            song_title: row.song_title,
            encore: row.encore,
          },
        }
        const res = await executeQueryWithLogging(
          prisma.event_setlist.update(params),
          'event_setlist.update',
          params
        )
        revalidateTag(eventSetlistTag(event_id))
        return {
          setlist: [
            ...state.setlist.slice(0, index),
            res,
            ...state.setlist.slice(index + 1),
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
          prisma.event_setlist.delete(params),
          'event_setlist.delete',
          params
        )
        revalidateTag(eventSetlistTag(event_id))
      }
      return {
        setlist: state.setlist.filter((_, i) => i !== index),
        error: undefined,
      }
    } catch (e) {
      console.error(e)
      return { ...state, error: Errors.DatabaseError.message }
    }
  }
}
