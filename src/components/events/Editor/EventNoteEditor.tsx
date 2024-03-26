'use client'

import Alert from '@/components/commons/Alert'
import SubmitButton from '@/components/commons/SubmitButton'
import { Event } from '@/db/events'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { updateEventNote } from './EventNoteEditorWrapper'

interface Props {
  event: Event
}

const EventNoteEditor = ({ event }: Props) => {
  const [result, setResult] = useState<Either<string, Event>>()
  return (
    <form action={async (data) => setResult(await updateEventNote(data))}>
      <input type="hidden" name="event_id" value={event.id} />
      <textarea
        id="note"
        name="note"
        defaultValue={event.note || ''}
        className="w-full h-64 p-2 border border-gray-300 rounded"
      />
      <div className="text-right">
        <SubmitButton>保存</SubmitButton>
      </div>
      {result?.isLeft && <Alert type="error" message={result.value} />}
    </form>
  )
}

export default EventNoteEditor
