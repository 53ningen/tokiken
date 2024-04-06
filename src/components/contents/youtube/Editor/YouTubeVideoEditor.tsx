'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import { youtubeVideoUrl } from '@/consts/metadata'
import { useFormState } from 'react-dom'
import { youTubeVideoEditorAction } from './YouTubeVideoEditorServer'

const PutVideoForm = () => {
  const [state, dispatch] = useFormState(youTubeVideoEditorAction, {})
  return (
    <form action={dispatch} className="grid gap-2">
      <input
        id="url"
        name="url"
        required
        placeholder="追加する動画の URL"
        type="url"
        autoComplete="off"
        className="border rounded w-full py-1 px-3 mr-4"
      />
      {state.error && <Alert type="error" message={state.error} />}
      {state.video && (
        <Alert
          type="success"
          message={`動画: ${state.video.title} の追加に成功しました`}
          href={youtubeVideoUrl(state.video.id)}
        />
      )}
      <div className="text-right">
        <ActionButton>動画追加</ActionButton>
      </div>
    </form>
  )
}

export default PutVideoForm
