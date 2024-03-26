'use client'

import Alert from '@/components/commons/Alert'
import { YouTubeChannel } from '@/db/youtube-vidoes'
import { Either } from '@/utils/either'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { syncYouTubeChannels } from './SyncYouTubeChannels'

const SyncYouTubeChannelsForm = () => {
  const [result, setResult] = useState<Either<string, YouTubeChannel[]>>()
  return (
    <form action={async (data) => setResult(await syncYouTubeChannels())}>
      <SubmitButton />
      {result?.isLeft && <Alert type="error" message={result?.value} />}
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
      } text-white py-2 px-4 rounded`}>
      チャンネルデータの同期
    </button>
  )
}

export default SyncYouTubeChannelsForm
