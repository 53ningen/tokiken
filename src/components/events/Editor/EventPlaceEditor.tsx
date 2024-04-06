'use client'
import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { prefectures } from '@/consts/region'
import { useRef } from 'react'
import { useFormState } from 'react-dom'
import { eventPlaceAction } from './EventPlaceAction'

const EventPlaceEditor = () => {
  const ref = useRef<HTMLFormElement>(null)
  const [state, dispatch] = useFormState(eventPlaceAction, {})
  return (
    <div key={JSON.stringify(state)}>
      <form action={dispatch} className="grid gap-2" ref={ref}>
        <FormItem id="name" label="会場名*">
          <input
            id="name"
            name="name"
            required
            type="text"
            autoComplete="off"
            className="w-full border rounded py-1 px-3"
          />
        </FormItem>
        <FormItem id="kana" label="会場名かな*">
          <input
            id="kana"
            name="kana"
            required
            type="text"
            autoComplete="off"
            className="w-full border rounded py-1 px-3"
          />
        </FormItem>
        <FormItem id="region" label="都道府県/地域*">
          <input
            id="region"
            name="region"
            required
            type="text"
            list="regions"
            autoComplete="off"
            className="border rounded w-64 py-1 px-3"
          />
          <datalist id="regions">
            {prefectures.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </datalist>
        </FormItem>
        <FormItem id="address" label="住所*">
          <input
            id="address"
            name="address"
            required
            type="text"
            autoComplete="off"
            className="w-full border rounded py-1 px-3"
          />
        </FormItem>
        {state.error && <Alert message={state.error} type="error" />}
        {state.eventPlace && (
          <Alert message={`${state.eventPlace.name} が追加されました`} type="success" />
        )}
        <div className="text-right">
          <ActionButton name="action" value="insert">
            イベント会場情報作成
          </ActionButton>
        </div>
      </form>
    </div>
  )
}

export default EventPlaceEditor
