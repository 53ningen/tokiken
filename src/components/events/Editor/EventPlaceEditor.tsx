'use client'
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
        <div className="flex items-center">
          <label htmlFor="name" className="block font-bold w-32">
            会場名
          </label>
          <input
            id="name"
            name="name"
            required
            type="text"
            autoComplete="off"
            className="border rounded w-64 py-1 px-3"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="kana" className="block font-bold w-32">
            会場名かな
          </label>
          <input
            id="kana"
            name="kana"
            required
            type="text"
            autoComplete="off"
            className="border rounded w-64 py-1 px-3"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="region" className="block font-bold w-32">
            都道府県/国・地域
          </label>
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
        </div>
        <div className="flex items-center">
          <label htmlFor="address" className="block font-bold w-32">
            住所
          </label>
          <input
            id="address"
            name="address"
            required
            type="text"
            autoComplete="off"
            className="border rounded w-64 py-1 px-3"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-4 rounded inline-block">
            イベント会場データ追加
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
