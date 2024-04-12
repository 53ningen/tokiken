'use client'

import ActionButton from '@/components/commons/ActionButton'
import Alert from '@/components/commons/Alert'
import FormItem from '@/components/commons/FormItem'
import { costumeImageUrl } from '@/consts/metadata'
import { Costume, CostumeImage } from '@/db/costumes'
import { Event, EventCostume } from '@/db/events'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { eventCostumeEditorAction } from './EventCostumeEditorWrapper'

interface Props {
  event: Event
  eventCostumes: (Costume & {
    event_costumes?: EventCostume[]
    costume_images?: CostumeImage[]
    event_costume_id: number
    display_order: number
  })[]
  allCostumes: (Costume & { costume_images: CostumeImage[] })[]
}

const EventCostumeEditor = ({ event, eventCostumes, allCostumes }: Props) => {
  const [state, dispatch] = useFormState(eventCostumeEditorAction, {})
  const [selectedCostume, setSelectedCostume] = useState<
    Costume & { costume_images: CostumeImage[] }
  >()
  return (
    <div className="grid gap-4 text-sm">
      <form action={dispatch} className="grid gap-4">
        <input type="hidden" name="event_id" value={event.id} />
        <FormItem id="costume_id" label="追加">
          <div className="flex gap-1">
            <img
              src={costumeImageUrl('xs', selectedCostume?.costume_images[0]?.image_key)}
              alt="selected costume"
              className="mr-4 w-8 h-8 rounded"
            />
            <input
              type="number"
              defaultValue={1}
              name="display_order"
              placeholder="表示順"
              className="border py-1 px-2 w-12 rounded"
            />
            <select
              name="costume_id"
              id="costume_id"
              required
              value={selectedCostume?.id || 44}
              onChange={(e) =>
                setSelectedCostume(
                  allCostumes.find((c) => c.id.toString() === e.currentTarget.value)
                )
              }
              className="border rounded py-1 px-2 mr-2">
              <option>衣装を選択</option>
              {allCostumes.map((costume) => (
                <option key={costume.id} value={costume.id}>
                  {costume.name}
                </option>
              ))}
            </select>
            <ActionButton name="action" value="insert">
              追加
            </ActionButton>
          </div>
          {state.error && <Alert type="error" message={state.error} className="my-4" />}
        </FormItem>
        <FormItem label="削除">
          {eventCostumes.length === 0 ? (
            <div className="text-gray-500">紐づいている衣装がありません</div>
          ) : (
            <table className="pt-4 [&_tr]:p-1 [&_td]:p-1">
              <thead className="text-gray-500 font-bold">
                <tr>
                  <td />
                  <td>表示順</td>
                  <td>衣装名</td>
                  <td />
                  <td />
                </tr>
              </thead>
              <tbody>
                {eventCostumes.map((item) => {
                  return (
                    <tr key={item.event_costume_id}>
                      <td>
                        <img
                          src={costumeImageUrl('xs', item.costume_images?.[0]?.image_key)}
                          alt={item.name}
                          className="w-8 h-8 rounded"
                        />
                      </td>
                      <td className="w-16">
                        <input
                          type="number"
                          defaultValue={item.display_order}
                          name={`display_order[${item.event_costume_id}]`}
                          placeholder="表示優先順位"
                          className="border py-1 px-2 w-16 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.name}
                          contentEditable={false}
                          disabled
                          placeholder="衣装名"
                          className="border py-1 px-2 w-full rounded"
                        />
                      </td>
                      <td>
                        <ActionButton
                          actionType="delete"
                          name="action"
                          value={`delete:${item.event_costume_id}`}>
                          削除
                        </ActionButton>
                      </td>
                      <td>
                        <ActionButton
                          name="action"
                          value={`update:${item.event_costume_id}`}>
                          更新
                        </ActionButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </FormItem>
      </form>
    </div>
  )
}

export default EventCostumeEditor
