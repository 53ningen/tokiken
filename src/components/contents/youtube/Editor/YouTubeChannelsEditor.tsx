'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import { useFormState } from 'react-dom'
import { youtubeChannelsEditorAction } from './YouTubeChannelsEditorServer'

const YouTubeChannelsEditor = () => {
  const [state, dispatch] = useFormState(youtubeChannelsEditorAction, {})
  return (
    <form action={dispatch} className="flex flex-col gap-2">
      <div>
        <ActionButton>チャンネルデータ更新</ActionButton>
      </div>
      {state.error && <Alert type="error" message={state.error} />}
      {state.updatedChannels !== undefined && (
        <Alert
          type="info"
          message={`${state.updatedChannels} 件のチャンネルデータを更新しました`}
        />
      )}
    </form>
  )
}

export default YouTubeChannelsEditor
