'use server'

import { Event, EventSetlist, eventSetlistTag, listEventSetlist } from '@/db/events'
import prisma from '@/db/prisma'
import { listSongs } from '@/db/songs'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import EventSetlistEditor from './EventSetlistEditor'

interface Props {
  event: Event
}

const EventSetlistEditorWrapper = async ({ event }: Props) => {
  const [songs, setlists] = await Promise.all([listSongs(), listEventSetlist(event.id)()])
  return <EventSetlistEditor event={event} songs={songs} setlist={setlists} />
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

  // 行の追加アクション
  if (action === 'add-row') {
    const res = addRow(state, event_id)
    return res
  }

  // 削除アクション
  const del = action.match(/delete:(\d+)/)
  const delIndex = del && parseInt(del[1])
  if (delIndex) {
    const res = deleteRow(state, data, event_id, delIndex)
    return res
  }

  // 行の更新・追加アクション
  const update = action.match(/update:(\d+)/)
  const updateIndex = update && parseInt(update[1])
  if (updateIndex) {
    const res = await updateRow(state, data, event_id, updateIndex)
    return res
  }

  return { ...state, error: Errors.InvalidRequest.message }
}

const extractRowData = async (data: FormData, i: number) => {
  const songs = await listSongs()
  const id = parseInt(data.get(`id[${i}]`) as string)
  const order = parseInt(data.get(`order[${i}]`) as string)
  const song = data.get(`song[${i}]`) as string
  const song_id = songs.find((s) => s.title === song)?.id || null
  if (song && !song_id) {
    return undefined
  }
  const song_title = data.get(`song_title[${i}]`) as string
  if (isNaN(id) || isNaN(order)) {
    return undefined
  } else {
    return { id, order, song_id, song_title: song_title === '' ? null : song_title }
  }
}

const addRow = (state: State, event_id: number) => {
  const emptyRow: EventSetlist = {
    id: -1,
    event_id,
    order: state.setlist.length + 1,
    song_id: null,
    song_title: null,
    note: null,
  }
  return {
    ...state,
    setlist: [...state.setlist, emptyRow],
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
        const res = await prisma.event_setlist.create({
          data: {
            event_id: event_id,
            order: row.order,
            song_id: row.song_id,
            song_title: row.song_title,
          },
        })
        revalidateTag(eventSetlistTag(event_id))
        return {
          setlist: [
            ...state.setlist.slice(0, index),
            res,
            ...state.setlist.slice(index + 1),
          ],
          error: undefined,
        }
      } else {
        const res = await prisma.event_setlist.update({
          where: { id: row.id },
          data: {
            order: row.order,
            song_id: row.song_id,
            song_title: row.song_title,
          },
        })
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
        await prisma.event_setlist.delete({ where: { id: row.id } })
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
