'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { prefectures } from '@/consts/region'
import { Event, EventPlace } from '@/db/events'
import { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'
import { eventEditorAction } from './EventEditorServer'

interface Props {
  event?: Event
  places: EventPlace[]
}

const EventEditor = ({ event, places }: Props) => {
  const prefs = prefectures.filter((p) => places.map((p) => p.region).includes(p))
  const [state, dispatch] = useFormState(eventEditorAction, {})
  const [prefecture, setPrefecture] = useState<string>()
  const ref = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (!event && state.event) {
      window.open(`/events/${state.event.id}/edit`, '_blank')
      ref.current?.reset()
    }
  }, [state.event])
  return (
    <form ref={ref} action={dispatch} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={event?.id} />
      <FormItem id="title" label="イベント名*">
        <input
          id="title"
          name="title"
          defaultValue={event?.title}
          required
          type="text"
          autoComplete="off"
          className="border rounded w-full py-1 px-3"
        />
      </FormItem>
      <FormItem id="type" label="イベントタイプ*">
        <select
          id="type"
          name="type"
          defaultValue={event?.type}
          className="border rounded py-1 px-3">
          <option value="LIVE">ライブ</option>
          <option value="EVENT">イベント</option>
          <option value="BROADCAST">配信</option>
          <option value="MILESTONE">マイルストン</option>
          <option value="OTHER">その他</option>
        </select>
      </FormItem>
      <FormItem id="date" label="開催日時*">
        <div className="flex gap-4">
          <input
            id="date"
            name="date"
            defaultValue={event?.date}
            required
            type="date"
            autoComplete="off"
            className="border rounded grow py-1 px-3"
          />
          <input
            id="start"
            name="start"
            defaultValue={event?.start || undefined}
            type="time"
            autoComplete="off"
            className="border rounded grow py-1 px-3"
          />
        </div>
      </FormItem>
      <FormItem id="place_id" label="会場">
        <div className="flex gap-4">
          <select
            id="prefecture"
            name="prefecture"
            value={prefecture}
            defaultValue={
              event?.place_id
                ? places.find((p) => p.id === event.place_id)?.region
                : undefined
            }
            className="border rounded grow py-1 px-3"
            onChange={(e) => setPrefecture(e.target.value)}>
            <option value={undefined} label="都道府県を選択" />
            {prefs.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
          <select
            id="place_id"
            name="place_id"
            defaultValue={event?.place_id?.toString()}
            className="grow border rounded py-1 px-3">
            <option value={undefined} label="会場を選択" />
            {places
              .filter((p) => (prefecture ? p.region === prefecture : true))
              .map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
          </select>
        </div>
      </FormItem>
      <FormItem id="note" label="メモ">
        <textarea
          id="note"
          name="note"
          placeholder="null"
          className="border rounded grow py-1 px-3"
        />
      </FormItem>
      {state.error && <Alert type="error" message={state.error} />}
      <div className="text-right">
        <ActionButton type="submit">
          {event ? 'イベント情報更新' : 'イベント情報作成'}
        </ActionButton>
      </div>
    </form>
  )
}

export default EventEditor
