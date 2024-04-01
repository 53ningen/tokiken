'use client'

import { Either } from '@/utils/either'
import { useRef, useState } from 'react'
import { revalidateTag } from './RevalidateTagAction'

const RevalidateTagForm = () => {
  const ref = useRef<HTMLFormElement>(null)
  const [result, setResult] = useState<Either<string, string>>()
  return (
    <form
      ref={ref}
      action={async (data) => {
        const res = await revalidateTag(data)
        setResult(res)
        res.isRight && ref.current?.reset()
      }}
      className="grid gap-2 text-sm">
      <div className="flex items-center [&>*]:mr-4">
        <label htmlFor="tag" className="block font-bold">
          Tag Name
        </label>
        <input
          id="tag"
          name="tag"
          required
          type="text"
          list="tags"
          className="border rounded w-64 py-1 px-3"
        />
        <datalist id="tags">
          <option value="songs">songs</option>
        </datalist>
        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-white font-bold py-1 px-4 rounded">
          Revalidate
        </button>
      </div>
      {result && (
        <div className={`${result.isLeft ? 'text-red-500' : 'text-blue-500'}`}>
          {result.value}
        </div>
      )}
    </form>
  )
}

export default RevalidateTagForm
