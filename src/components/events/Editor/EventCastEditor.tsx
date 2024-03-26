'use client'

import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import SubmitButton from '@/components/commons/SubmitButton'
import { getTokisenRegime } from '@/consts/tokisen'
import { Event, EventCast } from '@/db/events'
import { Either } from '@/utils/either'
import { useRef, useState } from 'react'
import { insertCasts, updateCasts } from './EventCastEditorWrapper'

interface Props {
  event: Event
  casts: EventCast[]
}

const EventCastEditor = ({ event, casts }: Props) => {
  const [result, setResult] = useState<Either<string, EventCast[]>>()
  const formRef = useRef<HTMLFormElement>(null)
  const { date } = event
  const { members, groupName } = getTokisenRegime(date)!
  const names = casts.map((cast) => cast.name)
  return (
    <form
      ref={formRef}
      action={async (data) => {
        console.log(data)
        setResult(await updateCasts(data))
      }}>
      <div className="flex">
        <FormItem label="出演者">
          <input type="hidden" name="event_id" value={event.id} />
          {members.map((member) => {
            const id = encodeURIComponent(member.name)
            return (
              <div key={member.name} className="mr-2">
                <input
                  type="checkbox"
                  id={id}
                  name={id}
                  defaultChecked={
                    names.includes(member.name) || names.includes(groupName)
                  }
                  className="mr-1"
                />
                <label htmlFor={id}>{member.name}</label>
              </div>
            )
          })}
        </FormItem>
      </div>
      <div className="text-right">
        <SubmitButton
          className="mr-2"
          onClick={async (e) => {
            e.preventDefault()
            setResult(await insertCasts(event.id, ...members.map((m) => m.name)))
            formRef.current?.reset()
          }}>
          全メンバー追加
        </SubmitButton>
        <SubmitButton>出演者更新</SubmitButton>
      </div>
      {result?.isLeft && <Alert type="error" message={result.value} />}
    </form>
  )
}

export default EventCastEditor
