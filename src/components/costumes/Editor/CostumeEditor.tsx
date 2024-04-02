'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { Costume } from '@/db/costumes'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { costumeEditorAction } from './CostumeEditorServer'

interface Props {
  costume?: Costume
}

const CostumeEditor = ({ costume }: Props) => {
  const [state, dispatch] = useFormState(costumeEditorAction, {})
  useEffect(() => {
    if (!costume && state.costume) {
      window.open(`/costumes/${state.costume.id}/edit`, '_blank')
    }
  }, [state.costume])
  return (
    <form action={dispatch} className="flex flex-col gap-2">
      <FormItem label="衣装名">
        <div className="flex gap-2">
          <input
            name="slug"
            placeholder="slug"
            defaultValue={costume?.slug || ''}
            required
            type="text"
            autoComplete="off"
            className="border rounded w-64 py-1 px-3"
          />
          <input
            name="name"
            placeholder="衣装名称"
            defaultValue={costume?.name || ''}
            required
            type="text"
            autoComplete="off"
            className="border rounded grow py-1 px-3"
          />
          <div className="flex gap-1 items-center">
            <input
              id="is_official_name"
              type="checkbox"
              name="is_official_name"
              value="1"
              defaultChecked={costume?.is_official_name || false}
            />
            <label htmlFor="is_official_name">公式名称</label>
          </div>
        </div>
      </FormItem>
      <FormItem label="衣装タイプ">
        <select
          name="type"
          defaultValue={costume?.type || 'chotokisen'}
          className="border rounded w-64 py-1 px-3">
          <option value="chotokisen">超ときめき♡宣伝部衣装</option>
          <option value="birthday">生誕祭衣装</option>
          <option value="tokisen">ときめき♡宣伝部衣装</option>
        </select>
      </FormItem>
      {state.error && <Alert type="error" message={state.error} />}
      <div className="text-right">
        <ActionButton type="submit">衣装情報作成</ActionButton>
      </div>
    </form>
  )
}

export default CostumeEditor
