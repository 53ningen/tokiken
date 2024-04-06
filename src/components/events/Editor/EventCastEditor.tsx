'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { getTokisenRegime } from '@/consts/tokisen'
import { Event, EventCast } from '@/db/events'
import { useFormState } from 'react-dom'
import { eventCastEditorAction } from './EventCastEditorWrapper'

interface Props {
  event: Event
  casts: EventCast[]
}

const EventCastEditor = ({ event, casts }: Props) => {
  const [state, dispatch] = useFormState(eventCastEditorAction, {})
  const { date } = event
  const { members } = getTokisenRegime(date)!
  const names = casts.map((cast) => cast.name)
  return (
    <form
      key={JSON.stringify(state)}
      action={dispatch}
      className="flex flex-col gap-2 pt-2">
      <input type="hidden" name="event_id" value={event.id} />
      <input
        type="hidden"
        name="regime_members"
        value={members.map((m) => m.name).join(',')}
      />
      <FormItem label="出演者">
        <div className="flex gap-2">
          {members.map((member) => {
            const id = encodeURIComponent(member.name)
            return (
              <div key={member.name} className="flex gap-1">
                <input
                  type="checkbox"
                  id={id}
                  name={id}
                  defaultChecked={names.includes(member.name)}
                />
                <label htmlFor={id}>{member.name}</label>
              </div>
            )
          })}
        </div>
      </FormItem>
      {state.error && <Alert type="error" message={state.error} />}
      <div className="text-right">
        <ActionButton name="action" value="update" className="mr-2">
          更新
        </ActionButton>
        <ActionButton name="action" value="insert_all">
          全メンバー追加
        </ActionButton>
      </div>
    </form>
  )
}

export default EventCastEditor
