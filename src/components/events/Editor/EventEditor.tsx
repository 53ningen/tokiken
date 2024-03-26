'use client'

import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import SubmitButton from '@/components/commons/SubmitButton'
import { prefectures } from '@/consts/region'
import { Event, EventPlace } from '@/db/events'
import { Either } from '@/utils/either'
import { useRef, useState } from 'react'
import { createEvent, updateEvent } from './EventEditorWrapper'

interface Props {
  event?: Event
  places: EventPlace[]
}

const EventEditor = ({ event, places }: Props) => {
  const candidateRegions = prefectures.filter((p) =>
    places.map((p) => p.region).includes(p)
  )
  const ref = useRef<HTMLFormElement>(null)
  const [result, setResult] = useState<Either<string, Event>>()
  const [selectedRegion, setSelectedRegion] = useState(
    places.find((p) => p.id === event?.place_id)?.region
  )
  return (
    <div>
      <form
        action={async (data) => {
          const res = await (event ? updateEvent(data) : createEvent(data))
          setResult(res)
          if (!event && res.isRight) {
            ref.current?.reset()
          }
        }}
        className="grid gap-2 mb-2"
        ref={ref}>
        <input type="hidden" name="id" value={event?.id || undefined} readOnly />
        <FormItem id="title" label="イベント名">
          <input
            id="title"
            name="title"
            defaultValue={event?.title}
            required
            type="text"
            autoComplete="off"
            className="border rounded grow py-1 px-3"
          />
        </FormItem>
        <FormItem id="region" label="都道府県">
          <select
            id="region"
            name="region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border rounded grow py-1 px-3">
            <option value={undefined}>---</option>
            {candidateRegions.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </FormItem>
        <FormItem id="place_id" label="イベント会場">
          <select
            id="place_id"
            name="place_id"
            defaultValue={event?.place_id || undefined}
            className="border rounded grow py-1 px-3">
            <option value={undefined}>---</option>
            {places
              .filter((p) => p.region === selectedRegion)
              .map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
          </select>
        </FormItem>
        <FormItem id="type" label="イベントタイプ">
          <select
            id="type"
            name="type"
            defaultValue={event?.type || 'LIVE'}
            required
            className="border rounded py-1 px-3">
            <option value="LIVE">ライブ</option>
            <option value="EVENT">イベント</option>
            <option value="BROADCAST">配信</option>
            <option value="MILESTONE">マイルストン</option>
            <option value="OTHER">その他</option>
          </select>
        </FormItem>
        <FormItem id="date" label="開催日">
          <input
            id="date"
            name="date"
            defaultValue={event?.date}
            required
            type="date"
            autoComplete="off"
            className="border rounded w-64 py-1 px-3"
          />
        </FormItem>
        <FormItem id="start" label="開演時間">
          <input
            id="start"
            name="start"
            defaultValue={event?.start || undefined}
            type="time"
            autoComplete="off"
            className="border rounded w-64 py-1 px-3"
          />
        </FormItem>
        <FormItem id="submit" label="">
          <div className="flex justify-end w-full">
            <SubmitButton>
              {event ? 'イベントデータ更新' : 'イベントデータ追加'}
            </SubmitButton>
          </div>
        </FormItem>
      </form>
      {result?.isLeft && <Alert type="error" message={result.value} className="my-4" />}
    </div>
  )
}

export default EventEditor
