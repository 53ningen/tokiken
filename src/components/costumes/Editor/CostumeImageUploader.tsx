'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { costumeImageUrl } from '@/consts/metadata'
import { Costume } from '@/db/costumes'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { costumeImageUploaderAction } from './CostumeImageUploaderServer'

interface Props {
  costume: Costume
}

const CostumeImageUploader = ({ costume }: Props) => {
  const [state, dispatch] = useFormState(costumeImageUploaderAction, {})
  const [file, setFile] = useState<File>()
  return (
    <div>
      <form action={dispatch} className="px-1 py-4">
        <input type="hidden" name="costume_id" value={costume.id} />
        <input type="hidden" name="image_key" value={state.imageKey} />
        {state.imageKey ? (
          <div className="flex flex-col gap-2">
            <FormItem label="画像">
              <img
                src={costumeImageUrl('md', state.imageKey)}
                alt="uploaded image"
                className="w-36 h-36 border"
              />
            </FormItem>
            <FormItem label="表示順">
              <input
                type="text"
                required
                name="display_order"
                className="py-1 px-3 w-10 border rounded"
                defaultValue={0}
              />
            </FormItem>
            <FormItem label="説明">
              <input
                type="text"
                required
                name="description"
                className="py-1 px-3 w-full border rounded"
              />
            </FormItem>
            <FormItem label="クレジット">
              <input
                type="text"
                required
                name="image_credit"
                className="py-1 px-3 w-full border rounded"
              />
            </FormItem>
            <FormItem label="クレジットURL">
              <input
                type="text"
                required
                name="image_credit_url"
                className="py-1 px-3 w-full border rounded"
              />
            </FormItem>
            <div className="text-right">
              <ActionButton name="action" value="insert">
                衣装データ追加
              </ActionButton>
            </div>
          </div>
        ) : (
          <div className="text-right">
            <ActionButton
              type="button"
              loading={file && !state.imageKey}
              onClick={() => document.getElementById('image_file')?.click()}>
              衣装写真追加
            </ActionButton>
          </div>
        )}
        {state.error && <Alert type="error" message={state.error} />}
      </form>
      <input
        id="image_file"
        type="file"
        name="image_file"
        hidden
        onChange={(e) => {
          const file = e.currentTarget.files?.[0]
          if (file) {
            const d = new FormData()
            d.append('action', 'upload')
            d.append('costume_id', costume.id.toString())
            d.append('file', file)
            e.currentTarget.files && dispatch(d)
            setFile(file)
          }
        }}
      />
    </div>
  )
}

export default CostumeImageUploader
