'use server'

import { Event, eventSetlistTag } from '@/db/events'
import { executeQueriesWithLogging } from '@/db/logs'
import prisma from '@/db/prisma'
import { listSongs } from '@/db/songs'
import { isAssociateUserServer } from '@/utils/amplify'
import { Errors } from '@/utils/errors'
import { revalidateTag } from 'next/cache'
import EventSetlistBulkEditor from './EventSetlistBulkEditor'

interface Props {
  event: Event
}

const EventSetlistBulkEditorWrapper = async ({ event }: Props) => {
  const songs = await listSongs()
  return <EventSetlistBulkEditor event={event} songs={songs} />
}

export default EventSetlistBulkEditorWrapper

interface State {
  error?: string
}

export const eventSetlistBulkEditorAction = async (
  state: State,
  data: FormData
): Promise<State> => {
  if (!(await isAssociateUserServer())) {
    return { ...state, error: Errors.NeedAssociatePermission.message }
  }
  const event_id = parseInt(data.get('event_id') as string)
  const raw_song_ids = data.get('song_ids') as string
  const song_ids = JSON.parse(raw_song_ids) as number[]
  if (isNaN(event_id) || !song_ids || song_ids.length === 0) {
    return { ...state, error: Errors.InvalidRequest.message }
  }
  try {
    const params = song_ids.map((song_id: number, i: number) => {
      return {
        data: {
          event_id,
          song_id,
          order: i + 1,
        },
      }
    })
    const queries = params.map((p) => prisma.event_setlist.create(p))
    await executeQueriesWithLogging(queries, 'event_setlist.bulk_create', params)
    revalidateTag(eventSetlistTag(event_id))
    return { error: undefined }
  } catch (e) {
    return { ...state, error: Errors.DatabaseError.message }
  }
}
