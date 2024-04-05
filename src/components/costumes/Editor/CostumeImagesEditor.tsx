'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import { costumeImageUrl } from '@/consts/metadata'
import { Costume, CostumeImage } from '@/db/costumes'
import { useFormState } from 'react-dom'
import { costumeImagesEditorAction } from './CostumeImagesEditorServer'

interface Props {
  costume: Costume
  images: CostumeImage[]
}

const CostumeImagesEditor = ({ costume, images }: Props) => {
  const [state, dispatch] = useFormState(costumeImagesEditorAction, {})
  return (
    <div>
      <form action={dispatch} className="text-sm">
        <input type="hidden" name="costume_id" value={costume.id} />
        <table className="w-full [&_tr]:p-1 [&_td]:p-1">
          <thead>
            <tr className="text-gray-500">
              <th className="w-20">画像</th>
              <th>表示順/説明</th>
              <th>クレジット/リンク先URL</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image) => (
              <tr key={image.id}>
                <td>
                  <img
                    src={costumeImageUrl('xs', image.image_key)}
                    alt={image.description}
                    className="w-20 h-20 object-cover"
                  />
                  <input
                    type="hidden"
                    name={`image_key[${image.id}]`}
                    value={image.image_key}
                  />
                </td>
                <td>
                  <div className="flex flex-col gap-1 justify-around">
                    <input
                      type="number"
                      name={`display_order[${image.id}]`}
                      placeholder="display_order"
                      defaultValue={image.display_order.toString()}
                      className="py-1 px-3 border rounded"
                    />
                    <input
                      type="text"
                      name={`description[${image.id}]`}
                      placeholder="description"
                      defaultValue={image.description}
                      className="py-1 px-3 border rounded"
                    />
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1 justify-around">
                    <input
                      type="text"
                      name={`image_credit[${image.id}]`}
                      placeholder="image_credit"
                      defaultValue={image.image_credit}
                      className="py-1 px-3 border rounded"
                    />
                    <input
                      type="url"
                      name={`image_credit_url[${image.id}]`}
                      placeholder="image_credit_url"
                      defaultValue={image.image_credit_url}
                      className="py-1 px-3 border rounded"
                    />
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1 justify-around">
                    <ActionButton
                      actionType="delete"
                      name="action"
                      value={`delete:${image.id}`}>
                      削除
                    </ActionButton>
                    <ActionButton
                      actionType="update"
                      name="action"
                      value={`update:${image.id}`}>
                      更新
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.error && <Alert type="error" message={state.error} />}
      </form>
    </div>
  )
}

export default CostumeImagesEditor
