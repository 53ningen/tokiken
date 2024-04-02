'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { Event, SetlistCredit } from '@/db/events'
import { useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import {
  getSetlistCreditSiteTitle,
  setlistCreditEditorAction,
} from './SetlistCreditEditorServer'

interface Props {
  event: Event
  credit?: SetlistCredit
}

const SetlistCreditEditor = ({ credit, event }: Props) => {
  const [title, setTitle] = useState(credit?.name)
  const [state, dispatch] = useFormState(setlistCreditEditorAction, {})
  const ref = useRef<HTMLFormElement>(null)
  return (
    <form ref={ref} action={dispatch} className="flex flex-col gap-2">
      {credit && <input name="id" type="hidden" value={credit.id} />}
      <input name="event_id" type="hidden" value={event.id} />
      <FormItem label="情報出典">
        <div className="flex flex-col gap-2">
          <input
            name="source_url"
            required
            defaultValue={credit?.source_url || ''}
            placeholder="出典 URL"
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
            onChange={async (e) => {
              const url = e.target.value
              if (url.startsWith('https://twitter.com/')) {
                const screenName = url.split('/')[3]
                setTitle(`@${screenName} on Twitter`)
              } else {
                const title = await getSetlistCreditSiteTitle(e.target.value)
                e.target.value && setTitle(title)
              }
            }}
          />
          <input
            name="name"
            required
            placeholder="クレジット名"
            value={title || ''}
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </FormItem>
      {state.error && <Alert type="error" message={state.error} />}
      <div className="text-right">
        <ActionButton type="submit">セットリスト出典情報更新</ActionButton>
      </div>
    </form>
  )
}

export default SetlistCreditEditor
