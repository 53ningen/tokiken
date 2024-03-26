'use server'

import { Event, eventTag } from '@/db/events'
import prisma from '@/db/prisma'
import { isAdminUserServer } from '@/utils/amplify'
import { Either, left, right } from '@/utils/either'
import { revalidateTag } from 'next/cache'
import EventNoteEditor from './EventNoteEditor'

interface Props {
  event: Event
}

const EventNoteEditorWrapper = async ({ event }: Props) => {
  return EventNoteEditor({ event })
}

export default EventNoteEditorWrapper

export const updateEventNote = async (date: FormData): Promise<Either<string, Event>> => {
  if (!(await isAdminUserServer())) {
    return left('本項目の編集には管理者権限が必要です')
  }

  const eventId = parseInt(date.get('event_id') as string)
  const note = date.get('note') as string
  if (isNaN(eventId) || eventId < 1) {
    return left('イベントIDが不正です')
  }

  try {
    const res = await prisma.events.update({
      where: { id: eventId },
      data: { note: note === '' ? null : note },
    })
    revalidateTag(eventTag(eventId))
    return right(res)
  } catch (e) {
    console.error(e)
    return left('データベースエラーが発生しました')
  }
}
