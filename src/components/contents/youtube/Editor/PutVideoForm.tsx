'use client'

import Alert from '@/components/commons/Alert'
import VideoCollection from '@/components/contents/youtube/VideoCollection/VideoCollection'
import { YouTubeVideoWithChannel } from '@/db/youtube-vidoes'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { putVideoFromForm } from './PutVideo'

const PutVideoForm = () => {
  const [result, setResult] = useState<Either<any, YouTubeVideoWithChannel>>()
  return (
    <form
      action={async (data) => {
        const res = await putVideoFromForm(data)
        setResult(res)
      }}
      className="grid gap-4">
      <div className="flex items-center">
        <label htmlFor="url" className="block font-bold w-32">
          動画の URL
        </label>
        <input
          id="url"
          name="url"
          required
          type="url"
          autoComplete="off"
          className="border rounded grow py-1 px-3 mr-4"
        />
        <SubmitButton />
      </div>
      {result?.isRight && (
        <div className="grid gap-2">
          <div className="text-blue-500">動画の追加に成功しました</div>
          <VideoCollection videos={[result.value]} />
        </div>
      )}
      {result?.isLeft && <Alert type="error" message={result.value} />}
    </form>
  )
}

const SubmitButton = () => {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${
        pending ? 'bg-blue-200' : 'bg-blue-500'
      } text-white py-1 px-4 rounded`}>
      追加
    </button>
  )
}

export default PutVideoForm
