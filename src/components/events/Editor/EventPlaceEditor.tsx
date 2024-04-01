'use client'
import FormItem from '@/components/commons/FormItem'
import { prefectures } from '@/consts/region'
import { Either } from '@/utils/either'
import { useRef, useState } from 'react'
import { createEventPlace } from './EventPlaceAction'

const EventPlaceEditor = () => {
  const ref = useRef<HTMLFormElement>(null)
  const [result, setResult] = useState<Either<string, string>>()
  return (
    <div>
      <form
        action={async (data) => {
          const res = await createEventPlace(data)
          setResult(res)
          res.isRight && ref.current?.reset()
        }}
        className="grid gap-2"
        ref={ref}>
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
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-4 rounded inline-block">
            イベント会場情報作成
          </button>
        </div>
      </form>
      {result && (
        <div className={`${result.isLeft ? 'text-red-500' : 'text-blue-500'}`}>
          {result.value}
        </div>
      )}
    </div>
  )
}

export default EventPlaceEditor
