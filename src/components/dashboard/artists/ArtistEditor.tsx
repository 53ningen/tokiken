'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { useEffect, useRef } from 'react'
import { useFormState } from 'react-dom'
import { artistEditorAction } from './ArtistEditorServer'

interface Props {}

const ArtistEditor = ({}: Props) => {
  const [state, dispatch] = useFormState(artistEditorAction, {})
  const ref = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (state.artist) {
      window.open(`/artists/${state.artist.id}`, '_blank')
      ref.current?.reset()
    }
  }, [state.artist])
  return (
    <form ref={ref} action={dispatch} className="flex flex-col gap-2">
      <FormItem label="名前*">
        <div className="flex gap-2">
          <input
            id="name"
            name="name"
            placeholder="名前"
            required
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
          <input
            id="kana"
            name="kana"
            placeholder="かな"
            required
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
          <input
            id="slug"
            name="slug"
            placeholder="slug"
            required
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
        </div>
      </FormItem>
      <FormItem label="SNS">
        <div className="flex gap-2">
          <input
            id="wikipedia"
            name="wikipedia"
            placeholder="wikipedia"
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
          <input
            id="twitter"
            name="twitter"
            placeholder="twitter"
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
          <input
            id="instagram"
            name="instagram"
            placeholder="instagram"
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
          <input
            id="tiktok"
            name="tiktok"
            placeholder="tiktok"
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
        </div>
      </FormItem>
      <FormItem label="URL">
        <div className="flex gap-2">
          <input
            id="url"
            name="url"
            placeholder="url"
            type="text"
            autoComplete="off"
            className="border rounded w-full py-1 px-3"
          />
        </div>
      </FormItem>
      {state.error && <Alert type="error" message={state.error} />}
      <div className="text-right">
        <ActionButton type="submit">アーティスト情報作成</ActionButton>
      </div>
    </form>
  )
}

export default ArtistEditor
